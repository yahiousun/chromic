import { Parser } from 'xml2js';
import { stripHtml } from './util';

class FeedParser {
  public id: string;
  public title: string;
  public updated: string;
  public link: string;
  public author: string;
  public categories: string[];
  public icon: string;
  public subtitle: string;
  public entries: FeedEntryObject[];
  public parser: Parser;
  constructor() {}
  public async parse(url: string): Promise<FeedObject> {
    return fetch(url)
      .then(response => response.text())
      .then((xmlString: string) => {
        return new Promise<FeedObject>((resolve, reject) => {
          this.parser = new Parser({ ignoreAttrs: true, explicitArray: false });
          this.parser.parseString(xmlString, (err, result) => {
            let raw;
            if (result && result.rss && result.rss.channel) {
              raw = result.rss.channel;
            } else if (result && result.feed) {
              raw = result.feed;
            }
            if (raw) {
              this.id = raw.guid || url;
              this.link = url;
              this.updated = raw.updated || raw.lastBuildDate || raw.pubDate || (new Date()).toISOString();
              this.title = raw.title;
              this.subtitle = raw.subtitle || raw.description;
              this.entries = [];

              raw.item.forEach((item) => {
                const entry: FeedEntryObject = {
                  id: item.guid || item.link,
                  author: item.author,
                  title: item.title,
                  summary: item.summary || stripHtml(item.description),
                  link: item.link,
                  updated: item.updated || item.pubDate || (new Date()).toISOString(),
                  read: 0,
                  categories: [],
                  source: this.link
                };
                this.entries.push(entry);
              });
            }
            const feed = this.toJSON();
            if (feed) {
              resolve(feed);
            } else {
              throw new TypeError('Feed not valid');
            }
          });
        });
      });
  }
  public toJSON(): FeedObject {
    if (this.id && this.title && this.updated) {
      return {
        id: this.id,
        title: this.title,
        updated: this.updated,
        link: this.link,
        author: this.author,
        categories: this.categories,
        icon: this.icon,
        subtitle: this.subtitle,
        entries: this.entries
      };
    }
    return null;
  }
}

export default FeedParser;
