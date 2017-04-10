import WebURL from './web_url';
import URLQueue from './url_queue';

interface URLFrontierOptionsObject {
  maxConnections: number;
  maxPages: number;
}

class URLFrontier {
  public queue: URLQueue;
  public complete: boolean;
  public options: URLFrontierOptionsObject;
  public heap: Map<string, boolean>;
  static get options() {
    return {
      maxConnections: 5,
      maxPages: 300
    };
  }
  constructor(options?: URLFrontierOptionsObject) {
    this.complete = false;
    this.options = Object.assign({}, URLFrontier.options, options || {});
    this.queue = new URLQueue();
  }
  public seen(url: string) {
    return this.heap.has(url);
  }
  public add(url: string) {
    if (!this.seen(url)) {
      this.heap.set(url, false);
      const weburl = new WebURL(url);
      this.schedule(weburl);
    } else {
      throw new Error('URL exist');
    }
    return this;
  }
  public schedule(weburl: WebURL) {
    if (!this.seen(weburl.url)) {
      this.heap.set(weburl.url, false);
    }
    this.queue.enqueue(weburl);
    return this;
  }
  public next() {
    if (this.complete) {
      return;
    }
    // Get next url to process
    const next = this.queue.dequeue();
    if (next) {
      this.heap.set(next.url, true);
    }
    return next;
  }
  public size() {
    return this.heap.size;
  }
  public finish() {
    this.complete = true;
    return this;
  }
}

export default URLFrontier;
