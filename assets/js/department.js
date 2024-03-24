let headers = [
  {
    name: "Nomi",
    slug: "title",
    input: true,
    placeholder: "Bo`lim nomini kiriting",
    type: "color",
    func: (val) => val.toUpperCase(),
  },
  {
    name: "Holati",
    slug: "status",
    type: "button",
    func: (val) =>
      val
        ? `<button class="btn success">Faol</button>`
        : `<button class="btn danger">Faol</button>`,
  },
];

let deparments = new Layout("department", "#depart", ".table", [], headers);
deparments.all();
const add = () => deparments.add();
const remove = (id) => deparments.remove(id);
const edit = (id) => deparments.edit(id);
const save = () => deparments.save();
