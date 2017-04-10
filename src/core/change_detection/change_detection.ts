import { sha1 } from '../util';

class ChangeDetection {
  public static detect() {

  }
  public static async compare(a, b) {
    return Promise.all([
      sha1(JSON.stringify(a)),
      sha1(JSON.stringify(b))
    ]).then((result) => {
      return result[0] === result[1];
    });
  }
}

export default ChangeDetection;
