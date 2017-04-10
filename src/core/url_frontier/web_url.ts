class WebURL {
  public url: string;
  public depth: number;
  public domain: string;
  public parent: string;
  public weight: number;
  constructor(input: string) {
    const url = new URL(input);
    const directories = url.pathname.split('/');

    this.url = input;
    this.depth = directories.length - 1
    this.domain = url.hostname;
    this.weight = 0;
  }
}

export default WebURL;
