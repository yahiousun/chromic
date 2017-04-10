class Canonicalization {
  public static url(href: string, context?: string): string {
    try {
      let url;
      if (context) {
        url = new URL(href, context);
      } else {
        url = new URL(href);
      }
      // Limiting protocols
      if (url.protocol !== 'http:') {
        url.protocol = 'http:';
      }
      // Removing all query variables
      return `${url.origin}${url.pathname}`;
    } catch (e) {
      return null;
    }
  }
  // Trim
  public static text(input: string) {
    try {
      return input.replace(/(<([^>]+)>)/ig, '').trim() || null;
    } catch (e) {
      return null;
    }
  }
  // ISO 8601 Date and time format
  public static date(input: string) {
    try {
      return (new Date(input)).toISOString();
    } catch (e) {
      return null;
    }
  }
}

export default Canonicalization;
