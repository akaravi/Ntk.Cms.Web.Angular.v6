export class WidgetInfoModel {
  title = '';
  description = '';
  link = '';
  items: WidgetContentInfoModel[];
  set(model: WidgetContentInfoModel) {
    if (!this.items)
      this.items = [];
    if (this.items.length == 0) {
      this.items.push(model);
      return;
    }
    var findIndex = false;
    for (let index = 0; index < this.items.length; index++) {

      if (this.items[index].key == model.key) {
        this.items[index] = model;
        findIndex = true;
        return
      }
    }
    if (!findIndex)
      this.items.push(model);
  }
}
export class WidgetContentInfoModel {
  constructor(_key: string, _index: number, _count: number, _lint = '', _color = '') {
    this.key = _key;
    this.index = _index;
    this.count = _count;
    this.link = _lint;
    this.color = _color;
  }
  key = '';
  index = 0;
  count = 0;
  description = '';
  link = '';
  color = '';
}
