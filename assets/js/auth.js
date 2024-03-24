let formReg = document.getElementById("reg");
let formLog = document.getElementById("log");


if (formReg) {
  formReg.onsubmit = async (e) => {
    e.preventDefault();
    let value = new Layout().getData(formReg);

    if (value.password !== value.repassword) {
      message("warning", "Parollar bir xil emas");
      return false;
    }

    let res = await axios.post(`${url}/auth/reg`, value);

    if (res.status == 201) {
      message("success",msgs[res.data]);
    }

    if (res.status == 200) {
      message("warning",msgs[res.data]);
    }

    formReg.reset();
  };
}

if (formLog) {
  formLog.onsubmit = async (e) => {
    e.preventDefault();
    let value = new Layout().getData(formLog);

    let res = await axios.post(`${new Layout().url}/auth/login`, value).catch((e) => {
      if ([404, 400].includes(e.response.status)) {
        message("danger", msgs[e.response.data]);
      }
    });

    if (res.status == 200) {
      let { token } = res.data;
      let str = {
        authorization: `Bearer ${token}`,
      };
      localStorage.setItem("auth", JSON.stringify(str));
      message("success", "Xush kelibsiz");
      setTimeout(() => {
        location = "index.html"
      }, 2000);
    }

    formLog.reset();
  };
}
let loginDiv = document.querySelector(".login");
let regDiv = document.querySelector(".reg");
const toggle = (e) => {
  e.preventDefault();
  loginDiv.classList.toggle("active");
  regDiv.classList.toggle("active");
  formLog.reset();
  formReg.reset();
};
