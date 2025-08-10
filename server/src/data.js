let items = [];
let nextId = 1;

function reset() {
  items = [
    { id: nextId++, title: "Item 1" },
    { id: nextId++, title: "Item 2" }
  ];
}

function getAll() {
  return items;
}

function create(title) {
  const item = { id: nextId++, title };
  items.push(item);
  return item;
}

function update(id, title) {
  const item = items.find(i => i.id === id);
  if (!item) return null;
  item.title = title;
  return item;
}

function remove(id) {
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

module.exports = { reset, getAll, create, update, remove };
