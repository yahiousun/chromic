import { default as manhuaDmzjCom } from './manhua.dmzj.com';
import SupportedSite from '../supported_site';

const FeedFinderAdapter = {
  [SupportedSite['manhua.dmzj.com']]: manhuaDmzjCom
}

export default FeedFinderAdapter;
