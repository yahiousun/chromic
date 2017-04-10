import URLFrontier from '../url_frontier';

class Crawler {
  public frontier: URLFrontier;
  constructor() {
    this.frontier = new URLFrontier();
  }
}

export default Crawler;
