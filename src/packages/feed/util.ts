import { MD5 } from 'crypto-js';

export function guid(url: string): string {
  const md5 = MD5(url).toString();
  return md5.replace(/^(\S{8})(\S{4})(\S{4})(\S{4})(\S{12})$/g, '$1-$2-$3-$4-$5');
}

export function xml2js(xml): any {
  if (!xml) {
    return null;
  }
  let obj = {};

  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
    obj['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    obj = xml.nodeValue;
  } else if (xml.nodeType === 4) {
    obj = xml.nodeValue;
  }

  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;

      if (typeof(obj[nodeName]) === 'undefined') {
        obj[nodeName] = xml2js(item);
      } else {
        if (typeof(obj[nodeName].push) === 'undefined') {
          let old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xml2js(item));
      }
    }
  }
  return obj;
};

export function text(node: Node) {
  let text = xml2js(node);
  if (text && text['#cdata-section']) {
    text = text['#cdata-section'];
  }

  if (typeof text === 'string') {
    return stripHtml(text);
  }
  return null;
}

export function stripHtml(htmlString): string {
  if (!htmlString) {
    return null;
  }
  const parser = new DOMParser();
  const html: HTMLDocument = parser.parseFromString(htmlString, 'text/html');
  return (html && html.body.innerText) || null;
}
