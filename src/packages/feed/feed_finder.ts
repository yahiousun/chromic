import FeedFinderAdapter from './feed-finder-adapter';
import FeedParser from './feed_parser';
import SupportedSite from './supported_site';

namespace FeedFinder {
  export async function find(url: string): Promise<string> {
    const adapter = identify(url);
    return adapter ? FeedFinderAdapter[adapter](url) : Promise.reject('FeedFinderAdapter not found');
  }

  export async function load(url: string): Promise<FeedObject> {
    const parser = new FeedParser();
    return parser.parse(url);
  }

  export function identify(url: string): number {
    const domain = (new URL(url)).host;
    return domain ? SupportedSite[domain] : null;
  }
}

export default FeedFinder;
