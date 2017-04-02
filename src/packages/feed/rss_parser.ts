import { guid, xml2js, text, stripHtml } from './util';

class RSSParser {
  public meta: FeedObject;
  public entries: FeedEntryObject[];
  static id(node: Element, url?: string) {
    const uuid = text(node);
    return uuid || (url ? guid(url) : null);
  }
  static title(node: Element) {
    return text(node);
  }
  static updated(node: Element) {
    return text(node) || (new Date()).toISOString();
  }
  static author(node: Element): FeedPersionObject {
    const author = xml2js(node);
    if (author && (author.name || author.email || author.uri)) {
      return author;
    }
    return author && author['#cdata-section'] ? { name: author['#cdata-section'] } : null;
  }
  static subtitle(node: Element) {
    return text(node);
  }
  static generator(node: Element) {
    return text(node);
  }
  static source (node: Element) {
    const source = xml2js(node);
    if (typeof source === 'string') {
      return {
        title: source
      }
    }
    if (source && source['#cdata-section']) {
      return {
        id: source['@attributes'].url,
        title: source['#cdata-section'],
        updated: source['@attributes'].pubDate
      }
    }
    return null;
  }
  static entry(node: Element) {
    const link = text(node.querySelector('link'));
    const entry: FeedEntryObject = {
      id: RSSParser.id(node.querySelector('guid'), link),
      title: RSSParser.title(node.querySelector('title')),
      updated: RSSParser.updated(node.querySelector('pubDate')),
      link: link,
      author: RSSParser.author(node.querySelector('author')),
      summary: text(node.querySelector('description')),
      source: RSSParser.source(node.querySelector('source'))
    };

    if (entry.id && entry.title && entry.updated) {
      return entry;
    }
    return null;
  }
  constructor() {}
  public parse(xmlString: string, url?: string) {
    const rss: Document = (new DOMParser()).parseFromString(xmlString, 'text/xml');
    const meta: FeedObject = {
      id: RSSParser.id(rss.querySelector('rss>channel>guid'), url),
      title: RSSParser.title(rss.querySelector('rss>channel>title')),
      updated: RSSParser.updated(rss.querySelector('rss>channel>pubDate')),
      link: url || null,
      subtitle: RSSParser.subtitle(rss.querySelector('rss>channel>description')),
      generator: RSSParser.generator(rss.querySelector('rss>channel>generator'))
    };
    const entries: FeedEntryObject[] = [];

    Array.from(rss.querySelectorAll('rss>channel>item')).forEach((item) => {
      const entry = RSSParser.entry(item);
      if (entry) {
        entries.push(entry);
      }
    });

    this.meta = meta;
    this.entries = entries;
    return {
      meta,
      entries,
    }
  }
}

export default RSSParser;
