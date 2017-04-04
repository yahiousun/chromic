export const LOADING = 'loading';
export const DONE = 'done';

interface EmbeddedOptions {
  styles?: any,
  attrs?: any
}

class Embedded {
  static styles = {
    width: '100%',
    height: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'fixed',
    zIndex: 2147483647,
    background: '#FFFFFF'
  }
  static attrs = {
    frameBorder: 0,
    allowTransparency: 0
  }
  public url: string;
  public ref: HTMLIFrameElement;
  public state: string;
  public options: EmbeddedOptions;
  constructor() {}

  public css(styles) {
    if (this.ref && styles) {
      Object.keys(styles).forEach((key) => {
        this.ref.style[key] = styles[key];
      });
    }
  }

  public attr(attrs) {
    if (this.ref && attrs) {
      Object.keys(attrs).forEach((key) => {
        this.ref[key] = attrs[key];
      });
    }
  }

  public load(url: string, options?: EmbeddedOptions) {
    this.url = url || this.url;
    this.options = Object.assign({}, options || { styles: Embedded.styles, attrs: Embedded.attrs });

    if (this.state !== LOADING) {
      this.state = LOADING;

      this.ref = document.createElement('iframe');

      this.css(this.options.styles);

      this.attr(this.options.attrs);

      this.ref.src = this.url;

      document.body.appendChild(this.ref);
      this.state = DONE;
      if (this.onload) {
        this.onload();
      }
    }
  }

  public unload() {
    if (this.ref) {
      this.ref.removeEventListener('load', this.onload);
      this.ref.parentNode.removeChild(this.ref);
      delete this.state;
      if (this.onunload) {
        this.onunload();
      }
    }
  }

  public reload() {
    if (this.ref && this.url && this.options) {
      this.unload();
      this.load(this.url, this.options);
    }
  }

  public onload = () => {
    document.body.style.overflow = 'hidden';
  }

  public onunload = () => {
    document.body.style.overflow = null;
  }
}

export default Embedded;
