import { Parser } from 'xml2js';

namespace FeedParser {
  export interface PostData {
    link: string;
    title: string;
    content: string;
    publishedDate: number;
    read: number;
    feedUrl?: string;
    author?: any;
    categories?: string[];
  }

  export interface FeedData {
    feedUrl: string;
    title: string;
    description: string;
    link: string;
    author?: string;
    entries?: PostData[];
  }

  export type FeedType = 'rss' | 'atom';

  export function identify(xmlString: string): any {
    return (/<(rss|rdf)\b/i.test(xmlString) ? 'rss' : (/<feed\b/i.test(xmlString) ? 'atom' : null));
  }

  export async function rss(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      new Parser({ ignoreAttrs: true, explicitArray: false }).parseString(xmlString, (err, result) => {
        if (result && result.rss && result.rss.channel) {
          const { channel } = result.rss;
          const feed: FeedData = {
            description: channel.description,
            feedUrl: '',
            link: channel.link,
            title: channel.title,
            entries: []
          };
          channel.item.forEach((item) => {
            feed.entries.push({
              author: item.author,
              title: item.title,
              content: item.description,
              link: item.link,
              publishedDate: Date.parse(item.pubDate) || Date.now(),
              read: 0,
              categories: []
            });
          });
          return resolve(feed);
        }
        return reject('Posts not found');
      });
    });
  }
  
  export async function atom(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      new Parser({ ignoreAttrs: true, explicitArray: false }).parseString(xmlString, (err, result) => {
        if (result) {
          const feed: FeedData = {
            feedUrl: '',
            title: result.title,
            description: result.subtitle,
            link: result.guid || result.uuid || result.url,
            entries: []
          };
          result.entry.forEach((item) => {
            feed.entries.push({
              title: item.title,
              content: item.summary || item.subtitle || item.content,
              link: item.link,
              publishedDate: Date.parse(item.updated) || Date.now(),
              read: 0,
              categories: []
            });
          });
          return resolve(feed);
        }
        return reject('Posts not found');
      });
    });
  }

  export async function parse(xmlString: string): Promise<FeedData> {
    const feedType: FeedType = identify(xmlString);
    if (feedType === 'rss') {
      return rss(xmlString);
    } else if (feedType === 'atom') {
      return atom(xmlString);
    }
    return Promise.reject('FeedParser not found');
  }
}

export default FeedParser;
