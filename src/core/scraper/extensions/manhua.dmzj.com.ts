import sandbox from '../../../sandbox';
import { NoDataError } from '../util';

const DOMAIN = 'manhua.dmzj.com';
const NAME = '动漫之家';
const IMAGE_PREFIX = 'http://images.dmzj.com/';

function identify(url: string) {
  return /^http(s)?:\/\/manhua.dmzj.com\/[\w]+\/(.*)?$/.test(url);
}

async function parse(doc: HTMLDocument) {
  return new Promise((resolve, reject) => {
    const metadata: any = {};
    // Get table of contents
    const $contents = doc.querySelectorAll('.cartoon_online_border a');
    // We have a table of contents
    if ($contents && $contents.length) {
      // Get comic title
      const $title = <HTMLElement>(doc.querySelector('.anim_title_text'));

      metadata.contents = Array.from($contents).map(($link: HTMLAnchorElement) => {
        return {
          title: $link.innerText || $link.getAttribute('title'),
          url: $link.getAttribute('href')
        };
      });
      if ($title) {
        metadata.title  = $title.innerText;
      }
      resolve(metadata);
    } else {
      const matches = doc.head.innerText.replace(/\n/g, '').match(/page\s\=\s'';\s*(.+?);\s*var\sg_comic_name/);
      const $title = <HTMLAnchorElement>(doc.querySelector('.hotrmtexth1 a'));
      const $subtitle = <HTMLSpanElement>(doc.querySelector('span.redhotl'));
      const $previous = <HTMLAnchorElement>(doc.querySelector('#prev_chapter'));
      const $next = <HTMLAnchorElement>(doc.querySelector('#next_chapter'));
      // We have a chapter or volume
      if (matches) {
        sandbox
          .eval(`${matches[1]}; eval(pages);`)
          .then((response: string[]) => {
            if (Array.isArray(response) && response.length) {
              // Get all images
              metadata.pages = response.map((src) => {
                // Fix prefix
                return (IMAGE_PREFIX + src);
              });
              if ($title) {
                // Get comic title
                metadata.title = $title.innerText;
                // Get contents link
                metadata.source = $title.getAttribute('href');
              }
              if ($subtitle) {
                // Get subtitle
                metadata.subtitle = $subtitle.innerText;
              }
              if ($previous) {
                // Get previous page
                metadata.previous = {
                  url: $previous.getAttribute('href'),
                  title: $previous.innerText
                };
              }
              if ($next) {
                // Get next page
                metadata.next = {
                  url: $next.getAttribute('href'),
                  title: $next.innerText
                };
              }

              resolve(metadata);
            } else {
              reject(NoDataError);
            }
          });
      } else {
        reject(NoDataError);
      }
    }
  });
}

async function scrape(url: string) {
  if (!identify(url)) {
    // URL Not Supported
    return Promise.reject(null);
  }
  return fetch(url)
    .then(response => response.text())
    .then((htmlString) => {
      const doc = (new DOMParser()).parseFromString(htmlString, 'text/html');
      return parse(doc);
    });
}

export default {
  domain: DOMAIN,
  name: NAME,
  identify,
  scrape,
  parse
};
