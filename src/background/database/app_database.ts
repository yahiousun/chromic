import Dexie from 'dexie';

import { Feed, Post, Category } from './model';

class AppDatabase extends Dexie {
  feeds: Dexie.Table<Feed, string>;
  posts: Dexie.Table<Post, string>;
  categories: Dexie.Table<Category, string>;
  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      feeds: 'id, title, updated, link, author, categories, icon, subtitle',
      posts: 'id, title, updated, read, link, author, content, summary, categories, enclosures, source',
      categories: 'term, scheme, label'
    });

    this.feeds.mapToClass(Feed);
    this.posts.mapToClass(Post);
    this.categories.mapToClass(Category);
  }
}

export default AppDatabase;
