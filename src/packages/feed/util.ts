import { MD5 } from 'crypto-js';

export function guid(url: string): string {
  const md5 = MD5(url).toString();
  return md5.replace(/^(\S{8})(\S{4})(\S{4})(\S{4})(\S{12})$/g, '$1-$2-$3-$4-$5');
}

export function stripHtml(htmlString): string {
  if (!htmlString) {
    return null;
  }
  const parser = new DOMParser();
  const html: HTMLDocument = parser.parseFromString(htmlString, 'text/html');
  return (html && html.body.innerText) || null;
}
