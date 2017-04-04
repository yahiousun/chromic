import { SAXStream, createStream } from 'sax';

class FeedParser {
  public meta: any;
  public entries: any[];
  public stack: any;
  public stream: SAXStream;
  public options: any;
  public base: string;
  constructor(url?: string, options?: any) {
    this.options = options || {};
    this.meta = {
      link: url || null
    };
    this.entries = [];
    this.stack = [];

    this.stream = createStream(true, { lowercase: true, xmlns: true });
    this.stream.on('processinginstruction', this.onprocessinginstruction);
    this.stream.on('onerror', this.onerror);
    this.stream.on('opentag', this.onopentag);
    this.stream.on('closetag',this.onclosetag);
    this.stream.on('text', this.ontext);
    this.stream.on('cdata', this.oncdata);
    this.stream.on('end', this.onend);
  }
  public onerror = () => {
    if (this.options.ignoreError) {
      this.stream.resume();
    }
  }
  public onprocessinginstruction = (node) => {
    if (node.name !== 'xml') {
      throw new TypeError('Feed not valid');
    }
  }
  public onopentag = (node) => {
    const obj = {};

    obj['#name'] = node.name.toLowerCase();
    obj['#prefix'] = node.prefix;
    obj['#local'] = node.local;
    obj['#uri'] = node.uri;
    obj['@'] = {};
    obj['#'] = '';
    obj['#cdata'] = '';

    if (Object.keys(node.attributes).length) {
      obj['@'] = this.onattribute(node.attributes, obj['#name']);
    }

    this.stack.unshift(obj);
  }
  public onclosetag = (name) => {
    const obj = this.stack.shift();

    if (this.stack.length) {
      if (this.stack[0][obj['#name']] && !Array.isArray(this.stack[0][obj['#name']])) {
        this.stack[0][obj['#name']] = [this.stack[0][obj['#name']]];
        this.stack[0][obj['#name']].push(obj);
      } else {
        this.stack[0][obj['#name']] = obj;
      }
    }
    if (obj['#name'] === 'item' || obj['#name'] === 'entry') {
      if (!this.meta.title) {
        Object.assign(this.meta, this.handlemeta(this.stack[0]));
      }
      const entry = this.handleentry(obj);
      if (entry) {
        if (!entry.author && this.meta.author) {
          entry.author = this.meta.author;
        }
        this.entries.push(entry);
      }
    } else if (!this.meta.title && (obj['#name'] === 'channel' || obj['#name'] === 'feed')) {
      Object.assign(this.meta, this.handlemeta(obj));
    }
  }
  public ontext = (text) => {
    if (this.stack[0]) {
      this.stack[0]['#'] += text;
    }
  }
  public oncdata = (cdata: string) => {
    if (this.stack[0]) {
      this.stack[0]['#'] += cdata.replace(/(<([^>]+)>)/ig, '');
      this.stack[0]['#cdata'] += cdata;
    }
  }
  public onend = () => {
    // Fix updated
    if (this.meta && !this.meta.updated) {
      this.meta.updated = (new Date()).toISOString();
    }
    if (!(this.meta && this.meta.id && this.meta.title && this.meta.updated)) {
      this.meta = null;
      throw new TypeError('Feed not valid');
    }
  }
  public onattribute = (attrs, name) => {
    const result = {};

    Object.keys(attrs).forEach((key) => {
      const attr = attrs[key];
      result[attr.name] = attr.value;
    });
    return result;
  }
  public handleauthor(data): PersonObject {
    const author: any = {};
    Object.keys(data).forEach((key) => {
      if (key === 'name') {
        author.name = data[key]['#'] || data[key]['#'] || null;
      } else if (key === 'email') {
        author.email = data[key]['#'] || null;
      } else if (key === 'uri') {
        author.uri = data[key]['#'] || null;
      }
    });

    if (!author.name && data['#']) {
      const email = data['#'].match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      const name = /\((.*?)\)/g.exec(data['#']);
      if (email) {
        author.email = email[0];
      }
      if (name) {
        author.name = name[1];
      } else {
        author.name = data['#'];
      }
    }

    return author.name ? author : null;
  }
  public handlemeta = (data) => {

    const meta: any = {
      id: null,
      title: null,
      updated: null,
      author: null,
      subtitle: null,
      icon: null,
      categories: []
    }

    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'id':
        case 'guid': {
          meta.id = data[key]['#'] || null;
          break;
        }
        case 'title': {
          meta.title = data[key]['#'] || null;
          break;
        }
        case('pubdate'):
        case('lastbuilddate'):
        case('published'):
        case('modified'):
        case('updated'):
        case('dc:date'): {
          let updated = data[key]['#'];
          if (!/Z$/.test(updated)) {
            updated = (new Date(updated)).toISOString();
          }
          meta.updated = updated;
          break;
        }
        case 'subtitle':
        case 'description': {
          meta.subtitle = data[key]['#'] || null;
          break;
        }
        case 'author': {
          meta.author = this.handleauthor(data[key]);
          break;
        }
        case 'link': {
          if (!this.meta.link) {
            if (Array.isArray(data[key])) {
              // Todo handle self
              data[key].forEach((link) => {
                if (!link['@']['type'] && !link['@']['rel']) {
                  meta.link = link['#'] || link['@']['href'] || null;
                  this.base = meta.link;
                }
              });
            } else {
              if (data[key]['@']['rel'] === 'self' && !this.meta.link) {
                this.meta.link = data[key]['#'] || data[key]['@']['href'] || null;
              }
              meta.link = data[key]['#'] || data[key]['@']['href'] || null;
              this.base = meta.link;
            }
          }
          break;
        }
        case 'icon':
        case 'image': {
          let icon = data[key]['#'];
          if (!icon) {
            if (data[key].url && data[key].url['#']) {
              icon = data[key].url['#'];
            }
          }
          meta.icon = icon || null;
          break;
        }
        default: {
          // Fix id
          if (!meta.id) {
            meta.id = this.meta.link;
          }
        }
      }
    });
    // Fix updated
    if (!meta.updated) {
      if (this.entries.length && this.entries[0].updated) {
        meta.updated = this.entries[0].updated;
      } else if (data.entry || data.item) {
        let entry;
        if (data.entry) {
          entry = Array.isArray(data.entry) ? data.entry[0] : data.entry;
        } else {
          entry = Array.isArray(data.item) ? data.item[0] : data.item;
        }
        meta.updated = entry.updated;
      } else {
        meta.updated = (new Date()).toISOString();
      }
    }
    return meta;
  }
  public handleentry = (data) => {
    const entry: any = {
      id: null,
      title: null,
      updated: null,
      summary: null,
      categories: [],
      enclosures: [],
      content: null,
      link: null,
      source: this.meta.link,
      read: 0
    };

    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'id':
        case 'guid': {
          entry.id = data[key]['#'] || null;
          break;
        }
        case 'title': {
          entry.title = data[key]['#'] || null;
          break;
        }
        case 'summary':
        case 'description': {
          entry.summary = data[key]['#'] || null;
          break;
        }
        case 'author': {
          entry.author = this.handleauthor(data[key]);
          break;
        }
        case('pubdate'):
        case('lastbuilddate'):
        case('published'):
        case('modified'):
        case('updated'):
        case('dc:date'): {
          let updated = data[key]['#'];
          if (!/Z$/.test(updated)) {
            updated = (new Date(updated)).toISOString();
          }
          entry.updated = updated;
          // Fix feed updated
          if (entry.updated && !this.meta.updated) {
            this.meta.updated = entry.updated;
          }
          break;
        }
        case 'link': {
          if (Array.isArray(data[key])) {
            // Todo handle enclosures
            data[key].forEach((link) => {
              if (!link['@']['type'] && !link['@']['rel']) {
                entry.link = link['#'] || link['@']['href'] || null;
              }
            });
          } else {
            entry.link = data[key]['#'] || data[key]['@']['href'] || null;
          }
          break;
        }
        default: {
          // Fix id
          if (!entry.id && entry.link) {
            entry.id = entry.link;
          }
        }
      }
    });
    if (entry.id && entry.title && entry.updated) {
      return entry;
    }
    return null;
  }
  public async load(url?: string): Promise<FeedObject> {
    if (url) {
      this.meta.url = url;
    }
    if (this.meta.url) {
      return fetch(url)
        .then(response => response.text())
        .then(xmlString => this.parse(xmlString));
    }
    return Promise.reject('No Feed URL');
  }
  public parse(data: string): FeedObject {
    this.stream.write(data);
    this.stream.end();
    if (this.meta.id && this.meta.title && this.meta.updated) {
      return {
        ...this.meta,
        entries: this.entries
      };
    }
    return null;
  }
}

export default FeedParser;
