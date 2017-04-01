
export default async function (url: string): Promise<string> {
  const regex: RegExp = /^http(s)?:\/\/www.dm5.com\/[\w]+(\/)?/

  if (!regex.test(url)) {
    return Promise.reject('URL not match');
  }

  function getFeedUrl(doc: HTMLDocument) {
    const feedLink = <HTMLAnchorElement>doc.querySelector('.rss2>a');
    const feedUrl: string = feedLink && feedLink.getAttribute('href');
    return feedUrl ? (new URL(url, feedUrl)).href : null;
  }

  return fetch(url)
    .then(response => response.text())
    .then(async (htmlString) => {
      const doc: HTMLDocument = (new DOMParser()).parseFromString(htmlString, 'text/html');
      const feedUrl: string = getFeedUrl(doc);
      const contentsLink = <HTMLAnchorElement>doc.querySelector('a[href^="/manhua-"');
      const contentsUrl: string = contentsLink && contentsLink.innerText === '退出阅读' && contentsLink.getAttribute('href');

      if (feedUrl) {
        return feedUrl;
      } else if (contentsUrl) {
        return await fetch((new URL(url, contentsUrl)).href)
          .then(response => response.text())
          .then((htmlString2) => {
            const doc2: HTMLDocument = (new DOMParser()).parseFromString(htmlString2, 'text/html');
            return getFeedUrl(doc2);
          });
      }
      return null;
    });
}
