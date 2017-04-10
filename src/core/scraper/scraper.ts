import SupportedSite from '../supported_site';
import Canonicalization from '../canonicalization';
import { WebURL } from '../url_frontier';
import extensions from './extensions';
import Analyzer from '../analyzer';
import { ComicObject, ComicEntryObject } from '../schema/comic.d';

export type ScraperExtensionIdentify = (url: string) => boolean;
export type ScraperExtensionScrape = (url: string) => Promise<ComicObject | ComicEntryObject>;
export type ScraperExtensionParse = (doc: HTMLDocument | JSON) => Promise<ComicObject | ComicEntryObject>;

export interface ScraperExtension {
  domain: string;
  name: string;
  identify: ScraperExtensionIdentify;
  scrape: ScraperExtensionScrape;
  parse: ScraperExtensionParse;
}

class Scraper {
  public static async scrape(href: string) {
    const url = Canonicalization.url(href);
    const module: ScraperExtension = Scraper.url2module(url);
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
