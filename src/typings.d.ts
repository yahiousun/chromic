/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface FeedPersionObject {
  name: string;
  email?: string;
  uri?: string;
}

interface FeedCategoryObject {
  label: string;
  term?: string;
  scheme?: string;
}

interface FeedSourceObject {
  title: string;
  id?: string;
  updated?: string;
}

interface FeedEntryObject {
  id: string;
  title: string;
  updated: string;
  link?: string;
  author?: FeedPersionObject;
  content?: any;
  summary?: string;
  categories?: FeedCategoryObject[];
  contributor?: FeedPersionObject;
  published?: string;
  rights?: string;
  source?: FeedSourceObject;
}

interface FeedObject {
  id: string;
  title: string;
  updated: string;
  link?: string;
  author?: FeedPersionObject;
  categories?: FeedCategoryObject[];
  contributor?: FeedPersionObject;
  generator?: string;
  icon?: string;
  logo?: string;
  rights?: string;
  subtitle?: string;
  entries?: FeedEntryObject[];
}
