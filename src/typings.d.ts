/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface PersonObject {
  name: string;
  email?: string;
  uri?: string;
}

interface FeedEntryObject {
  id: string;
  title: string;
  updated: string;
  read: number;
  link?: string;
  author?: PersonObject;
  content?: any;
  summary?: string;
  categories?: string[];
  enclosures?: string[];
  source?: string;
}

interface FeedObject {
  id: string;
  title: string;
  updated: string;
  link?: string;
  author?: PersonObject;
  categories?: string[];
  icon?: string;
  subtitle?: string;
  entries?: FeedEntryObject[];
}
