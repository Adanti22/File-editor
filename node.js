const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.post("/createFolder/:login", async (req, res) => {
  const login = req.params.login; // Получаем логин из параметра запроса

  if (!login) {
    return res.status(400).send("Нет логина");
  }

  const folderPath = path.join(__dirname, "Folders", login);

  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
    return res.status(200).send("Folder created successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error creating folder.");
  }
});
app.post("/createFile", async (req, res) => {
  const { login, fileName } = req.body;

  if (!login || !fileName) {
    return res.status(400).send("Отсутствуют логин или имя файла");
  }

  const folderPath = path.join(__dirname, "Folders", login);
  const filePath = path.join(folderPath, `${fileName}.txt`);

  try {
    const folderExists = await fs.promises.stat(folderPath);
    if (!folderExists.isDirectory()) {
      return res.status(404).send("Папка пользователя не найдена");
    }

    await fs.promises.writeFile(filePath, "", "utf-8");
    return res.status(200).send("Файл создан успешно.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Ошибка при создании файла.");
  }
});

app.get("/getFiles/:login", async (req, res) => {
  const { login } = req.params;
  if (!login) {
    return res.status(400).send("Отсутствует логин");
  }

  try {
    const folderPath = path.join(__dirname, "Folders", login);
    const folderExists = await fs.promises.stat(folderPath);
    if (!folderExists.isDirectory()) {
      return res.status(404).send("Папка пользователя не найдена");
    }
    const files = await fs.promises.readdir(folderPath);
    const textFiles = [];

    for (const file of files) {
      if (file.endsWith(".txt")) {
        const filePath = path.join(folderPath, file);
        const textContent = await fs.promises.readFile(filePath, "utf-8");
        textFiles.push({
          fileName: file.replace(".txt", ""),
          text: textContent,
        });
      }
    }
    console.log(textFiles);
    return res.status(200).json({ files: textFiles });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Ошибка при получении списка файлов.");
  }
});
app.post("/updateFile", async (req, res) => {
  const { login, fileName, text } = req.body;
  if (!login || !fileName || !text) {
    return res.status(400).send("Отсутствуют необходимые параметры");
  }

  try {
    const folderPath = path.join(__dirname, "Folders", login);
    const filePath = path.join(folderPath, `${fileName}.txt`);
    const folderExists = await fs.promises.stat(folderPath);
    if (!folderExists.isDirectory()) {
      return res.status(404).send("Папка пользователя не найдена");
    }

    const fileExists = await fs.promises
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return res.status(404).send("Файл не найден");
    }
    console.log(text);
    await fs.promises.writeFile(filePath, text, "utf-8");
    return res.status(200).send("Текст файла успешно обновлен");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Ошибка при обновлении файла");
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
