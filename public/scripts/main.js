// Курс: Разработка интерфейса на JavaScript
// Дисциплина: Разработка десктопных и серверных приложений с помощью NodeJS

// Практическая работа №12-13: Создание веб-сервера на NodeJS

// Практическая работа состоит из 2-х частей: работа с сервером node.js и работа с инструментами для front-end разработки (препроцессоры, сборщики и т.д.)
// Описание задания:
// Вам предстоит создать текстовый редактор с возможностью сохранять данные на сервере.
// 1.	Сервер. Имеет следующие возможности:
// a.	Сохранение файлов с последующей загрузкой.
// b.	Учетные записи.
// c.	Просмотр всех созданных файлов.
// d.	Редактирование уже имеющихся файлов.
// 2.	Клиентская часть.
// a.	Удобное использование (UX).
// b.	Приятный внешний вид (UI).
// c.	Возможности стандартных текстовых редакторов.

// Пояснение:
// •	Оформление файла должно сохраняться.
// •	Для реализации сервера выбираете любой удобный вам способ.
// •	При реализации клиентской части можно воспользоваться сборщиками пакетов и препроцессорами CSS.

const formContainer = document.querySelector(".form");
const goToRegistr = document.getElementById("go-to-registr");
const loginForm = document.querySelector(".login-form");
const registrForm = document.querySelector(".registration-form");

const fly1 = document.querySelector(".fly");
const fly2 = document.querySelector(".fly_2");

const returnBtn = document.querySelector("#return-btn");
const wrapper = document.querySelector(".wrapper");

const registrLogin = document.querySelector("#registr__login");
const registrPassword = document.querySelector("#registr__password");

const logInLogin = document.querySelector("#log__in__login");
const logInPassword = document.querySelector("#log__in__password");

const logBtn = document.getElementById("log__in__btn"); // login btn
const regBtn = document.getElementById("registr__btn"); // regis btn
///

const logValidObj = {
  login: 0,
  pass: 0,
};
const registrValidObj = {
  login: 0,
  pass: 0,
};

goToRegistr.addEventListener("click", () => {
  loginForm.style.display = "none";
  registrForm.style.display = "flex";
  fly1.style.transform = "rotate(-30deg)";
  fly1.style.top = "40%";
  fly2.style.transform = "rotate(30deg)";
  fly2.style.top = "50%";
});

const returnFunc = () => {
  registrForm.style.display = "none";
  loginForm.style.display = "flex";
  fly1.style.transform = "rotate(30deg)";
  fly1.style.top = "50%";
  fly2.style.transform = "rotate(-30deg)";
  fly2.style.top = "40%";
};
returnBtn.addEventListener("click", () => {
  returnFunc();
});

logInLogin.addEventListener("blur", () => {
  if (logInLogin.value.length > 3) {
    logInLogin.classList.add("input-valid");
    logInLogin.classList.remove("input-unvalid");
    logValidObj.login = 1;
    if (logValidObj.pass == 1) {
      logBtn.classList.add("btn-valid");
    }
  } else {
    logInLogin.classList.add("input-unvalid");
    logInLogin.classList.remove("input-valid");
    logValidObj.login = 0;
    logBtn.classList.remove("btn-valid");
  }
});
logInPassword.addEventListener("blur", () => {
  if (logInPassword.value.length > 5) {
    logInPassword.classList.add("input-valid");
    logInPassword.classList.remove("input-unvalid");
    logValidObj.pass = 1;
    if (logValidObj.login == 1) {
      logBtn.classList.add("btn-valid");
    }
  } else {
    logInPassword.classList.add("input-unvalid");
    logInPassword.classList.remove("input-valid");
    logValidObj.pass = 0;
    logBtn.classList.remove("btn-valid");
  }
});
let files = [];
let loginValue = "";

logBtn.addEventListener("click", async () => {
  if (logValidObj.login == 1 && logValidObj.pass == 1) {
    let isAuth = 0;
    let currentLogin;
    if (localStorage.getItem("accounts")) {
      const dataBase = JSON.parse(localStorage.getItem("accounts"));
      dataBase.forEach((acc) => {
        if (
          acc.login == logInLogin.value &&
          acc.password == logInPassword.value
        ) {
          currentLogin = acc.login;
          isAuth = 1;
        }
      });
      if (isAuth) {
        loginValue = currentLogin;
        const title = `Hello, ${currentLogin}`;
        formContainer.innerHTML = title;
        formContainer.style.fontSize = "5vw";
        try {
          fetch(`http://localhost:3000/getFiles/${loginValue}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              files = data.files;
              const filesContainer = document.querySelector(".files-container");

              files.forEach((file) => {
                const fileItem = document.createElement("div");
                fileItem.classList.add("file-item");
                const fileContent = document.createElement("div");
                fileContent.classList.add("file-content");
                const img = document.createElement("img");
                img.src = "img/fly-txt1.png";
                const span = document.createElement("span");
                span.textContent = `${file.fileName}.txt`;
                const fileItemForm = document.createElement("div");
                fileItemForm.classList.add("file-item-form");
                const textarea = document.createElement("textarea");
                textarea.textContent = file.text;
                const button = document.createElement("button");
                button.classList.add("button", "btn-edit");
                button.textContent = "Изменить";
                button.addEventListener("click", function () {
                  editFile(this, file.fileName);
                });

                fileContent.appendChild(img);
                fileContent.appendChild(span);
                fileItemForm.appendChild(textarea);
                fileItemForm.appendChild(button);
                fileItem.appendChild(fileContent);
                fileItem.appendChild(fileItemForm);
                filesContainer.appendChild(fileItem);
              });
            });
          // .then((data) => {
          //   files = data.files;
          //   files.forEach((file) => {
          //     const fileItem = `
          //       <div class="file-item">
          //         <div class="file-content">
          //           <img src="img/fly-txt1.png" alt="">
          //           <span>${file.fileName}.txt</span>
          //         </div>
          //         <div class="file-item-form">
          //           <textarea>${file.text}</textarea>
          //           <button class="button btn-edit" onClick="editFile()">Изменить</button>
          //         </div>
          //       </div>
          //     `;
          //     document.querySelector(".files-container").innerHTML +=
          //       fileItem;
          //   });
          // });
        } catch (error) {
          console.error(error);
        }

        setTimeout(() => {
          formContainer.innerHTML = "";
          formContainer.style.display = "none";
          wrapper.style.display = "block";
        }, 3000);
      } else {
        alert("Неверный логин или пароль");
      }
    } else {
      alert("Неверный логин или пароль");
    }
  }
});
const editFile = async (e, fileName) => {
  const text = e.parentNode.querySelector("textarea").value;
  console.log(fileName);
  console.log(loginValue);
  try {
    const response = await fetch(` http://localhost:3000/updateFile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: loginValue,
        text: text,
        fileName: fileName,
      }),
    });
    alert("Текст обновлен");
  } catch (error) {
    console.error(error);
  }
};
//reg
registrLogin.addEventListener("blur", () => {
  if (registrLogin.value.length > 3) {
    registrLogin.classList.add("input-valid");
    registrLogin.classList.remove("input-unvalid");
    registrValidObj.login = 1;
    if (registrValidObj.pass == 1) {
      regBtn.classList.add("btn-valid");
    }
  } else {
    registrLogin.classList.add("input-unvalid");
    registrLogin.classList.remove("input-valid");
    registrValidObj.login = 0;
    regBtn.classList.remove("btn-valid");
  }
});

const resetReg = () => {
  registrPassword.classList.remove("input-unvalid");
  registrPassword.classList.remove("input-valid");
  registrLogin.classList.remove("input-unvalid");
  registrLogin.classList.remove("input-valid");
  regBtn.classList.remove("btn-valid");
  registrPassword.value = "";
  registrLogin.value = "";
  registrValidObj.login = 0;
  registrValidObj.pass = 0;
};

registrPassword.addEventListener("blur", () => {
  if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(registrPassword.value)) {
    registrValidObj.pass = 1;

    registrPassword.classList.add("input-valid");
    registrPassword.classList.remove("input-unvalid");
    if (registrValidObj.login == 1) {
      regBtn.classList.add("btn-valid");
    }
  } else {
    registrValidObj.pass = 0;
    registrPassword.classList.add("input-unvalid");
    registrPassword.classList.remove("input-valid");
    regBtn.classList.remove("btn-valid");
    alert("Не менее 5 символов, минимум 1 цифра, 1 буква (только латиница) ");
  }
});

regBtn.addEventListener("click", async () => {
  if (registrValidObj.login == 1 && registrValidObj.pass == 1) {
    const dataBase = JSON.parse(localStorage.getItem("accounts")) || [];
    let isExist = 0;
    let newLogin = registrLogin.value;
    dataBase.forEach((acc) => {
      if (acc.login == registrLogin.value) {
        isExist = 1;
        resetReg();
      }
    });
    if (!isExist) {
      dataBase.push({
        login: registrLogin.value,
        password: registrPassword.value,
      });
      localStorage.setItem("accounts", JSON.stringify(dataBase));
      console.log("asdasd");
      try {
        const response = await fetch(
          ` http://localhost:3000/createFolder/${newLogin}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ login: newLogin }),
          }
        );
      } catch (error) {
        console.error(error);
      }
      confirm("Вы зарегистрировались! Теперь необходимо войти");
      resetReg();
      returnFunc();
    } else {
      alert("Такой логин уже есть");
    }
  }
});

const fileAddBtn = document.getElementById("file-add-btn");
const fileInput = document.getElementById("file-input");
let newFiles = [];
fileAddBtn.addEventListener("click", async () => {
  if (fileInput.value) {
    if (
      files.find((file) => file.fileName === fileInput.value) ||
      newFiles.includes(fileInput.value)
    ) {
      alert("Файл с таким именем уже есть");
      return;
    }
    console.log(files);
    try {
      fetch(`http://localhost:3000/createFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: loginValue,
          fileName: fileInput.value,
        }),
      }).then((res) => console.log(res));
      const filesContainer = document.querySelector(".files-container");
      const fileItem = document.createElement("div");
      fileItem.classList.add("file-item");
      const fileContent = document.createElement("div");
      fileContent.classList.add("file-content");
      const img = document.createElement("img");
      img.src = "img/fly-txt1.png";
      const span = document.createElement("span");
      span.textContent = `${fileInput.value}.txt`;
      const fileItemForm = document.createElement("div");
      fileItemForm.classList.add("file-item-form");
      const textarea = document.createElement("textarea");
      textarea.textContent = "";
      const button = document.createElement("button");
      button.classList.add("button", "btn-edit");
      button.textContent = "Изменить";
      button.addEventListener("click", function () {
        editFile(this, fileInput.value);
      });

      fileContent.appendChild(img);
      fileContent.appendChild(span);
      fileItemForm.appendChild(textarea);
      fileItemForm.appendChild(button);
      fileItem.appendChild(fileContent);
      fileItem.appendChild(fileItemForm);
      filesContainer.appendChild(fileItem);
      newFiles.push(fileInput.value);
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Введие название файла");
  }
});
/*   */

// {

// }
