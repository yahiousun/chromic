/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface FeedEntryObject {
  id: string;
  title: string;
  updated: string;
  read: number;
  link?: string;
  author?: string;
  content?: any;
  summary?: string;
  categories?: string[];
  source?: string;
}

interface FeedObject {
  id: string;
  title: string;
  updated: string;
  link?: string;
  author?: string;
  categories?: string[];
  icon?: string;
  subtitle?: string;
  entries?: FeedEntryObject[];
}
