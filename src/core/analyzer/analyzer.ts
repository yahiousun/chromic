import Canonicalization from '../canonicalization';
import { sha1 } from '../util';
import { NoDataError } from '../scraper/util';

class Analyzer {
  public static refine(data: any, context: string) {
    const result: any = {};
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        switch (key) {
          case 'source':
          case 'url': {
            result[key] = Canonicalization.url(data[key], context);
            break;
          }
          case 'title':
          case 'subtitle':
          case 'author': {
            result[key] = Canonicalization.text(data[key]);
            break;
          }
          case 'next':
          case 'previous': {
            result[key] = {
              title: Canonicalization.text(data[key].title),
              url: Canonicalization.url(data[key].url, context),
            };
            break;
          }
          case 'contents': {
            result.contents = [];
            data[key].forEach((link) => {
              result.contents.push({
                title: link.title,
                url: Canonicalization.url(link.url, context)
              })
            });
            break;
          }
          default: {
            result[key] = data[key];
          }
        }
      }
    });
    return result;
  }
  public static async analyze(data: any, context: string) {
    const metadata: any = {};
    const refined = Analyzer.refine(data, context);

    if (refined.title && (refined.pages || refined.contents)) {
      return Promise.resolve({ ...refined, url: context, id: await Analyzer.url2id(context) });
    }
    return Promise.reject(NoDataError);
  }
  public static async url2id(url: string) {
    return sha1(url);
  }
}

export default Analyzer;
