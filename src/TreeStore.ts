import { Item } from "./type";

export default class TreeStore {
  #items: Item[];
  #getAllChildren: { [id: Item["id"]]: Item[] } = {};
  #getAllParents: { [id: Item["id"]]: Item[] } = {};
  #listWithIDKeys: { [id: Item["id"]]: Item } = {};
  #childrenList: { [id: Item["id"]]: Item[] } = {};
  constructor(items: Item[]) {
    this.#items = items;

    items.forEach((element) => {
      // this.#listWithIDKeys

      this.#listWithIDKeys[element.id] = element;
    });
    items.forEach((element) => {
      // this.#childrenList

      if (!this.#listWithIDKeys[element.parent]) {
        return;
      }
      if (!this.#childrenList[element.parent]) {
        this.#childrenList[element.parent] = [];
      }
      this.#childrenList[element.parent].push(element);
    });

    items.forEach((element) => {
      // this.#getAllChildren

      const children = (id: Item["id"]) => {
        let childrenlist = this.#childrenList[id];
        if (!childrenlist) {
          return;
        }
        if (!this.#getAllChildren[element.id]) {
          this.#getAllChildren[element.id] = [];
        }
        this.#getAllChildren[element.id] =
          this.#getAllChildren[element.id].concat(childrenlist);
        childrenlist.forEach((item) => {
          children(item.id);
        });
      };

      children(element.id);

      // this.#getAllParents

      const allParents = (item: Item, parents: Item[] = []): Item[] => {
        item = this.#listWithIDKeys[item.parent];
        if (!item) {
          return parents;
        }
        parents.push(item);
        return allParents(item, parents);
      };
      this.#getAllParents[element.id] = allParents(element);
    });
  }

  getAll() {
    return this.#items;
  }

  getItem(id: Item["id"]) {
    return this.#listWithIDKeys[id] || [];
  }

  getChildren(id: Item["id"]) {
    return this.#childrenList[id] || [];
  }

  getAllChildren(id: Item["id"]) {
    return this.#getAllChildren[id] || [];
  }

  getAllParents(id: Item["id"]) {
    return this.#getAllParents[id] || [];
  }
}
