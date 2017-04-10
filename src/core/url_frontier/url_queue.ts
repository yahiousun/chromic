import WebURL from './web_url';

class URLQueue {
  public array: WebURL[];
  constructor() {
    this.array = [];
  }
  public enqueue(weburl: WebURL) {
    this.array.push(weburl);
  }
  public dequeue() {
    return this.array.shift();
  }
  public rearrange() {
    this.array.sort((a, b) => {
      return a.weight - b.weight;
    });
  }
}

export default URLQueue;
