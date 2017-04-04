import Dexie from 'dexie';

import { Feed, Post } from './model';

class AppDatabase extends Dexie {
  feeds: Dexie.Table<Feed, string>;
  posts: Dexie.Table<Post, string>;
  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      feeds: 'id, title, updated, link, author, categories, icon, subtitle',
      posts: 'id, title, updated, read, link, author, content, summary, categories, enclosures, source'
    });

    this.feeds.mapToClass(Feed);
    this.posts.mapToClass(Post);
  }
}

export default AppDatabase;
