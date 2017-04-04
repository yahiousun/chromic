import db from '../index';

class Post {
  public id: string;
  public title: string;
  public updated: string;
  public read: number;
  public link: string;
  public author: PersonObject;
  public content: any;
  public summary: string;
  public categories: string[];
  public enclosures: any[];
  public source: string;

  constructor(props: FeedEntryObject) {
    Object.assign(this, props);
  }

  public async markAsRead() {
    return db.transaction('rw', db.posts, async() => {
      this.read = (await db.posts.update(this.link, { read: 1 })) ? 1 : 0;
    });
  }
}

export default Post;
