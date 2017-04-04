import db from '../index';

class Category {
  public term: string;
  public scheme: string;
  public label: string;

  constructor(props: CategoryObject) {
    Object.assign(this, props);
  }

  public async rename(label: string) {
    return db.transaction('rw', db.categories, async() => {
      this.label = (await db.categories.update(this.term, { label: label })) ? label : this.label;
    });
  }
}

export default Category;
