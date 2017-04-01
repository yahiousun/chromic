import FeedFinderAdapter from './feed-finder-adapter';
import FeedParser from './feed_parser';
import SupportedSite from './supported_site';

namespace FeedFinder {
  export async function find(url: string): Promise<string> {
    const adapter = identify(url);
    return adapter ? FeedFinderAdapter[adapter](url) : Promise.reject('FeedFinderAdapter not found');
  }

  export async function load(feedUrl: string): Promise<FeedParser.FeedData> {
    // const domain = Util.domain(feedUrl);
    // if (FeedPaserAdapter[domain]) {
    //   return FeedPaserAdapter[domain](feedUrl);
    // }
    return fetch(feedUrl)
      .then(response => response.text())
      .then(xmlString => FeedParser.parse(xmlString))
      .then(feed => {
        feed.feedUrl = feedUrl;
        feed.entries.forEach(entry => entry.feedUrl = feedUrl);
        return feed;
      });
  }

  export function identify(url: string): number {
    const domain = (new URL(url)).host;
    return domain ? SupportedSite[domain] : null;
  }
}

export default FeedFinder;
