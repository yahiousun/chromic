import db from '../index';
import Post from './Post';

class Feed {
  public id: string;
  public title: string;
  public updated: string;
  public link: string;
  public author: PersonObject;
  public categories: string[];
  public icon: string;
  public subtitle: string;
  public entries: Post[];
  constructor(props: FeedObject) {
    Object.assign(this, props);
  }

  public async delete() {
    return db.transaction('rw', db.feeds, async() => {
      // Remove feed
      return Promise.all([
        db.feeds.where('link').equals(this.link).delete(),
        db.posts.where('source').equals(this.link).delete()
      ]);
    });
  }

  public async query(pageNumber: number, itemsPerpage: number) {
    return db
      .posts
      .where('source').equals(this.link)
      .reverse()
      .offset(pageNumber * itemsPerpage).limit(itemsPerpage)
      .toArray().then((result) => {
        this.entries = result;
      });
  }

  public async merge(posts: Post[]) {
    const latestPosts = await db
      .posts
      .where('source').equals(this.link)
      .reverse()
      .limit(posts.length)
      .toArray();

    const newPosts: Post[] = posts
      .reduce((last, next: Post) => {
        const hasPost = latestPosts.some((item) => {
          return item.link === next.link;
        });
        if (!hasPost) {
          last.push(next);
        }
        return last;
      }, <Post[]>[])
      .sort((a, b) => {
        return Date.parse(a.updated) - Date.parse(b.updated);
      });

    if (newPosts.length) {
      return db.transaction('rw', db.posts, async() => {
        return db.posts.bulkAdd(newPosts);
      });
    }
    return Promise.resolve([]);
  }
  public async markAsRead() {
    const promises = [];
    db.posts
      .where('source')
      .equals(this.link)
      .and(post => post.read === 0)
      .each((post) => {
        promises.push(post.markAsRead());
      });
    return Promise.all(promises);
  }
}

export default Feed;
