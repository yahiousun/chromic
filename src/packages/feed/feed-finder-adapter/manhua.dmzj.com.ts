export default async function (url: string): Promise<string> {
  const regex: RegExp = /^http(s)?:\/\/manhua.dmzj.com\/[\w]+(\/|\/[\d]+.shtml)?(\?from=rssReader)?(#@page=[\d]+)?/

  if (!regex.test(url)) {
    return await Promise.reject('URL not match');
  }

  return await fetch(url.replace(/[\d]+.shtml(\?from=rssReader)?(#@page=[\d]+)?/, ''))
    .then(response => response.text())
    .then((htmlString) => {
      const doc: HTMLDocument = (new DOMParser()).parseFromString(htmlString, 'text/html');
      const feedLink = <HTMLAnchorElement>doc.querySelector('a[href$="/rss.xml"]');
      const feedUrl: string = feedLink && feedLink.getAttribute('href');
      return feedUrl ? (new URL(url, feedUrl)).href : null;
    });
}
