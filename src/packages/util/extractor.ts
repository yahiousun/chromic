namespace Extractor {
  export interface MediaGroup {
    mediaGroups: {
      contents: MediaObject[]
    }
  }

  export interface MediaObject {
    url: string,
    type: string,
    medium: string,
    width: number,
    height: number,
  }
  
  export function text(input: string) {
    const parser = new DOMParser();
    const html: HTMLDocument = parser.parseFromString(input, 'text/html');
    return (html && html.body.innerText) || null;
  }

  export function media(input: string, baseUrl: string): MediaGroup[] {
    const parser = new DOMParser();
    const html: HTMLDocument = parser.parseFromString(input, 'text/html');

    const contents: MediaObject[] = [];

    Array.from(html.images).forEach((image: HTMLImageElement) => {
      contents.push({
        url: image.src,
        type: '',
        medium: 'image',
        width: image.width,
        height: image.height
      });
    });

    if (contents.length) {
      return [{
        mediaGroups: { contents }
      }];
    }
    return null;
  }
}

export default Extractor;
