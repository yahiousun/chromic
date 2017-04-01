import { default as manhuaDmzjCom } from './manhua.dmzj.com';
import SupportedSite from '../SupportedSite';

const FeedFinderAdapter = {
  [SupportedSite['manhua.dmzj.com']]: manhuaDmzjCom
}

export default FeedFinderAdapter;
