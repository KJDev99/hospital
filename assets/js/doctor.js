const { MaskInput } = Maska;
new MaskInput("[data-maska]");

let headers = [
  {
    name: "Ism Sharifi",
    slug: "name",
  },
  {
    name: "Mutaxasisligi",
    slug: "spec",
  },
  {
    name: "Bo'lim",
    slug: "department",
  },
  {
    name: "Telefon raqami",
    slug: "phone",
  },
  {
    name: "Ish grafigi",
    slug: "worktime",
    func: (val) => {
      let res = worktimeList.find((time) => time.id == val);
      return res ? res.name : "";
    },
  },
  //   {
  //     name: "Holati",
  //     slug: "status",
  //     type: "button",
  //     func: (val) =>
  //       val
  //         ? `<button class="btn success">Faol</button>`
  //         : `<button class="btn danger">Faol</button>`,
  //   },
];
let parTitles = [
  "Shaxsiy ma`lumotlar",
  "Mutaxasislik ma`lumotlar",
  "Ish faoliyati tarixi",
];
let familyList = [
  {
    id: 1,
    title: "Uylangan/Turmushga chiqqan",
  },
  {
    id: 2,
    title: "Uylanmagan/Turmushga chiqmagan",
  },
];
let educationList = [
  {
    id: 1,
    title: "O'rta",
  },
  {
    id: 2,
    title: "O'rta maxsus",
  },
  {
    id: 2,
    title: "Oliy ma'lumotli",
  },
];
let worktimeList = [
  {
    id: 1,
    name: "Yarim stafka",
  },
  {
    id: 2,
    name: "To`liq stafka",
  },
  {
    id: 3,
    name: "O`rindosh",
  },
];
let step = 1;

let doctors = new Layout("doctor", "#doctorform", ".table", [], headers);

doctors.renderSelect(regions, "form select[name='region']", "id", "name");
doctors.renderSelect(familyList, "form select[name='family']", "id", "title");
doctors.renderSelect(
  worktimeList,
  "form select[name='worktime']",
  "id",
  "name"
);
doctors.renderSelect(
  educationList,
  "form select[name='education']",
  "id",
  "title"
);

doctors.all();

new Layout().getAll("spec", "form select[name=spec]", "title");
new Layout().getAll("department", "form select[name=department]", "title");

const getDistrict = (e) => {
  let list = districts.filter((district) => {
    if (district.region_id == e.target.value) return district;
  });
  doctors.renderSelect(list, "form select[name='district']", "id", "name");
};

// doctors.populate("department", "department");
// const add = () => doctors.add();
const remove = (id) => doctors.remove(id);
const edit = (id) => doctors.edit(id);
const save = () => doctors.save();

const next = () => {
  if (step == 2) {
    doctors.add();
    return false;
  }
  let inputs = document.querySelectorAll(`form #step_${step} [name]`);
  let check = false;
  inputs.forEach((input) => {
    if (!input.value) {
      check = true;
      return;
    }
  });
  if (check) {
    message("warning", "Barcha maydonlarni to`ldiring!");
  } else {
    document.querySelector(`form #step_${step}`).style.display = "none";
    step++;
    document.querySelector(`.modal .step`).innerHTML = step;
    document.querySelector(`.modal .part`).innerHTML = parTitles[step - 1];
    document.querySelector(`form #step_${step}`).style.display = "flex";
  }
};

const back = () => {
  if (step == 1) {
    openModal();
    return false;
  }
  document.querySelector(`form #step_${step}`).style.display = "none";
  step--;
  document.querySelector(`.modal .step`).innerHTML = step;
  document.querySelector(`.modal .part`).innerHTML = parTitles[step - 1];
  document.querySelector(`form #step_${step}`).style.display = "flex";
};
