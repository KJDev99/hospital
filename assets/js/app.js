const menu = [
  {
    title: "Bosh sahifa",
    img: "./assets/img/home.svg",
    url: "index.html",
    active: false,
  },
  {
    title: "Bo'limlar",
    img: "./assets/img/department.svg",
    url: "department.html",
    active: false,
  },
  {
    title: "Mutaxassisliklar",
    img: "./assets/img/department.svg",
    url: "spec.html",
    active: false,
  },
  {
    title: "Palatalar",
    img: "./assets/img/palata.svg",
    url: "room.html",
    active: false,
  },
  {
    title: "Shifokorlar",
    img: "./assets/img/doctors.svg",
    url: "doctor.html",
    active: false,
  },
  {
    title: "Bemorlar",
    img: "./assets/img/bemora.svg",
    url: "patient.html",
    active: false,
  },
];

let msgs = {
  success: "Muvofaqyatli ro`yxatdan o`tdinggiz",
  exist: "Bunday foydalanuvchi mavjud",
  required: "Maydonlarni to`ldiring",
  "User topilmadi": "Bunday foydalanuvchi mavjud emas",
  "Parolda xatolik bor": "Parolda xatolik bor",
  "Auth error": "Tizimdan foydalanishga ruxsat yo`q",
};

const message = (type, text) => {
  let box = document.querySelector(".notif");

  if (!box) {
    box = document.createElement("div");
    document.body.append(box);
  }
  box.classList.add("notif", type);
  box.textContent = text;
  setTimeout(() => {
    box.classList.add("active");
  }, 500);
  setTimeout(() => {
    box.classList.remove("active", type);
  }, 4000);
};

const addZero = (val) => (val > 9 ? val : "0" + val);
const convertDate = (date) => {
  let d = new Date(date);
  return `${addZero(d.getDate())}/${addZero(
    d.getMonth() + 1
  )}/${d.getFullYear()}`;
};

const openModal = (type = "") => {
  let modal = document.querySelector(".modal");
  let form = document.querySelector(".modal form");

  let editBtn = document.querySelector(".btn_edit");
  let addBtn = document.querySelector(".btn_add");

  if (type == "edit") {
    editBtn.classList.remove("hide");
    addBtn.classList.add("hide");
    document.querySelector(".modal h3").innerHTML = `Ma'lumotni tahrirlash`;
  } else {
    editBtn.classList.add("hide");
    addBtn.classList.remove("hide");
    document.querySelector(".modal h3").innerHTML = `Yangi malumot qo'shish`;
  }

  if (modal) {
    modal.classList.toggle("open");
  }
  if (form) {
    form.reset();
  }
};

let nav = document.querySelector("nav");

if (nav) {
  nav.innerHTML = "";
  let urlArr = location.href.split("/");
  let url = urlArr.at(-1);
  menu.forEach((item) => {
    nav.innerHTML += `
        <a class="${url == item.url ? "active" : ""} " href="${item.url}">
          <img src="${item.img}" /> ${item.title}
        </a>
      `;
  });
}

class Layout {
  url = "http://95.130.227.52:3112";
  local = "auth";
  head = {};
  obj = {};
  constructor(list = "", form = "", table = "", arr = [], headers = {}) {
    this.list = list;
    this.form = form;
    this.table = table;
    this.arr = arr;
    this.headers = headers;
  }
  checkToken = () => {
    let headers = JSON.parse(localStorage.getItem(this.local));
    if (!headers) {
      message("danger", "Tizimga Kiring");
      setTimeout(() => {
        location = "auth.html";
      }, 2000);
      return false;
    }
    return headers;
  };

  getData = (form) => {
    let data = new FormData(form);
    let value = {};
    for (let val of data) value[val[0]] = val[1];
    return value;
  };

  async all() {
    this.head = { headers: this.checkToken() };
    let res = await axios
      .get(`${this.url}/${this.list}`, this.head)
      .catch((e) => {
        if ((e.response.status = 401)) {
          message("warning", msgs[e.response.data]);
          location = "auth.html ";
        }
      });
    if (res.status == 200) {
      this.arr = [...res.data];
      this.render();
    }
  }

  async getAll(list, target, elemTitle) {
    this.head = { headers: this.checkToken() };
    let res = await axios.get(`${this.url}/${list}`, this.head).catch((e) => {
      if ((e.response.status = 401)) {
        message("warning", msgs[e.response.data]);
        location = "auth.html ";
      }
    });
    if (res.status == 200) {
      this.renderSelect([...res.data], target, "_id", elemTitle);
    }
  }

  async add() {
    let form = document.querySelector(this.form);
    if (form) {
      let value = this.getData(form);
      let res = await axios.post(`${this.url}/${this.list}`, value, this.head);
      if (res.status == 201) {
        this.arr = [res.data, ...this.arr];
        this.render();
        message("success", "Yangi bo`lim qoshildi");
        openModal();
      }
    } else {
      message("danger", "Xatolik bo'ldi");
    }
  }

  async remove(id) {
    if (confirm("Qaroringgiz qa`tiymi?")) {
      let res = await axios.delete(`${this.url}/${this.list}/${id}`, this.head);
      if (res.status == 200) {
        message("warning", "Ma`lumot o`chirildi");
        this.arr = this.arr.filter((item) => item._id !== id);
        this.render();
      }
    }
  }

  async edit(id) {
    let res = await axios
      .get(`${this.url}/${this.list}/${id}`, this.head)
      .catch((e) => {
        if ((e.response.status = 401)) {
          message("warning", msgs[e.response.data]);
          location = "auth.html ";
        }
      });
    if (res.status == 200) {
      openModal("edit");
      this.obj = { ...res.data };
      for (let key in this.obj) {
        let formEl = document.querySelector(`.modal form [name=${key}]`);
        if (formEl) {
          formEl.value = this.obj[key];
        }
      }
    }
  }

  async save() {
    let form = document.querySelector(this.form);
    if (form) {
      let value = this.getData(form);
      value = { ...this.obj, ...value };
      let res = await axios.put(`${this.url}/${this.list}`, value, this.head);
      if (res.status == 200) {
        this.arr = this.arr.map((el) => {
          if (el._id == res.data._id) return res.data;
          return el;
        });
        this.render();
        message("success", "Ma'lumot yangilandi");
        openModal();
      }
    } else {
      message("danger", "Xatolik bo'ldi");
    }
  }

  render = () => {
    let t = document.querySelector(this.table);
    if (t) {
      let thead = "";
      this.headers.forEach((head) => {
        thead += `<td>${head.name}</td>`;
      });
      t.innerHTML = `
        <thead>
          <tr>
            <th>№</th>
            ${thead}
            <th>Yaratilgan vaqti</th>
            <th></th>
          </tr>
        </thead>
      `;
      this.arr.forEach((item, index) => {
        let res = "";
        this.headers.forEach((head) => {
          res += `<td>
            ${head.func ? head.func(item[head.slug]) : item[head.slug]}
          </td>`;
        });
        t.innerHTML += `
            <tr>
            <td>${index + 1}</td>
            ${res}
            <td>${convertDate(item.createdTime)}</td>
            <td class="text-right">
              <button onclick="edit('${
                item._id
              }')" class="ml-10"><img src="./assets/img/edit.svg" /></button>
              <button onclick="remove('${
                item._id
              }')" class="ml-10"><img src="./assets/img/remove.svg" /></button>
            </td>
          </tr>
        `;
      });
    }
  };

  renderSelect = (list, target, elemId = "id", elemName = "name") => {
    let elem = document.querySelector(target);
    elem.innerHTML = `<option value="">Ro'yxatdan tanlang</option>`;
    list.forEach((item) => {
      elem.innerHTML += `
        <option value="${item[elemId]}">
          ${item[elemName]}
        </option>
      `;
    });
  };

  async populate(db, name = "") {
    let element = document.querySelector(`.modal form [name=${name}]`);
    element.innerHTML = "";
    let res = await axios.get(`${this.url}/${db}`, this.head);
    if (res.status == 200) {
      res.data.forEach((el) => {
        element.innerHTML += `
          <option value="${el._id}">${el.title}</option>
        `;
      });
    }
  }
}
