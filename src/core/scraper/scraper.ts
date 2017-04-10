import SupportedSite from '../supported_site';
import Canonicalization from '../canonicalization';
import { WebURL } from '../url_frontier';
import extensions from './extensions';
import Analyzer from '../analyzer';

class Scraper {
  public static async scrape(href: string) {
    const url = Canonicalization.url(href);
    const module = Scraper.url2module(url);
    if (module && url) {
      return module
        .scrape(url)
        .then(response => Analyzer.analyze(response, url));
    } else {
      return Promise.reject('Site Not Supported');
    }
  }
  // Get parser module
  public static url2module(url: string) {
    const weburl = new WebURL(url);
    const supported = SupportedSite[weburl.domain];
    if (supported) {
      return extensions[weburl.domain];
    }
    return null;
  }
}

export default Scraper;
