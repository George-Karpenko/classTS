import TreeStore from "./TreeStore";
import type { Item } from "./type";

const items: Item[] = [
  { id: 4, parent: 2, type: "test" },
  { id: 5, parent: 2, type: "test" },
  { id: 2, parent: 1, type: "test" },
  { id: 3, parent: 1, type: "test" },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
  { id: 1, parent: "root" },
  { id: 6, parent: 2, type: "test" },
];
function sortID(a: Item, b: Item) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

const ts = new TreeStore(items);

test("getAll", () => {
  expect(ts.getAll().sort((a, b) => sortID(a, b))).toEqual(
    items.sort((a, b) => sortID(a, b))
  );
});

test("getItem", () => {
  items.forEach((item) => {
    expect(ts.getItem(item.id)).toEqual(item);
  });
});

test("getItemNonExistentID", () => {
  const id = "nonExistentID";
  const getItem = [];

  expect(ts.getItem(id)).toEqual(getItem);
});

test("getChildren", () => {
  items.forEach((item) => {
    const getChildren: Item[] = items.filter(
      (itemFilter) => itemFilter.parent === item.id
    );

    expect(ts.getChildren(item.id).sort((a, b) => sortID(a, b))).toEqual(
      getChildren.sort((a, b) => sortID(a, b))
    );
  });
});

test("getChildrenRootID", () => {
  const ID = "root";

  expect(ts.getChildren(ID)).toEqual([]);
});

test("getChildrenNonexistentID", () => {
  const ID = "nonexistentID";
  const getChildren = [];

  expect(ts.getChildren(ID)).toEqual(getChildren);
});

test("getAllChildren", () => {
  const allChildren = (item: Item, childrens: Item[] = []): Item[] => {
    childrens = items.filter((itemFilter) => itemFilter.parent === item.id);
    childrens.forEach((item) => {
      childrens = childrens.concat(allChildren(item, childrens));
    });
    return childrens;
  };

  items.forEach((item) => {
    expect(ts.getAllChildren(item.id).sort((a, b) => sortID(a, b))).toEqual(
      allChildren(item).sort((a, b) => sortID(a, b))
    );
  });
});

test("getAllChildrenRootID", () => {
  const ID = "root";

  expect(ts.getAllChildren(ID)).toEqual([]);
});

test("getAllChildrenNonexistentParent", () => {
  const parent = "nonexistentParent";
  const getAllChildren = [];

  expect(ts.getAllChildren(parent)).toEqual(getAllChildren);
});

test("getAllParents", () => {
  const allParent = (item: Item, parents: Item[] = []): Item[] => {
    const itemFind = items.find((element) => element.id === item.parent);
    if (!itemFind) {
      return parents;
    }
    parents.push(itemFind);
    return allParent(itemFind, parents);
  };

  items.forEach((item) => {
    expect(ts.getAllParents(item.id)).toEqual(allParent(item));
  });
});

test("getAllParentsNonexistentID", () => {
  const id = "nonexistentID";
  const getAllParents = [];

  expect(ts.getAllParents(id)).toEqual(getAllParents);
});
