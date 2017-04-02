import RSSParser from './rss_parser';

namespace FeedParser {
  export function identify(xmlString: string) {
    return (/<(rss|rdf)\b/i.test(xmlString) ? 'rss' : (/<feed\b/i.test(xmlString) ? 'atom' : null));
  }
  export async function parse(url: string) {
    return fetch(url)
      .then(response => response.text())
      .then((xmlString) => {
        const feedType = identify(xmlString);
        let feed = null;
        if (feedType === 'rss') {
          feed = (new RSSParser()).parse(xmlString, url);
        }
        return feed;
      }
    );
  }
}

export default FeedParser;
