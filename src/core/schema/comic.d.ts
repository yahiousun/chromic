export interface LinkObject {
  href: string;
  title: string;
}

export interface ComicEntryObject {
  title: string;
  subtitle: string;
  id?: string;
  url?: string;
  pages?: string[];
  source?: string;
  previous?: LinkObject,
  next?: LinkObject
}

export interface ComicObject {
  title: string;
  id?: string;
  url?: string;
  author?: string;
  contents?: LinkObject[]
}
