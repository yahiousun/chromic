import { Scraper} from '../core';

console.log('Background Works');

chrome.browserAction.onClicked.addListener((tab) => {
  Scraper
    .scrape(tab.url)
    .then((res) => {
      console.log('res', res);
    }, (error) => {
      console.log('error', error);
    })
    .catch((err) => {
      console.log('error', err);
    });
});
