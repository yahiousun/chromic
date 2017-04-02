import { ContentRequestMessageService, MethodType } from '../packages/request-message-service';
import Embeddeb, { DONE } from '../packages/embeddeb';

const messageService = new ContentRequestMessageService();
const embeddebApp = new Embeddeb();

messageService.onrequest = (request) => {
  if (request.method === MethodType.SESSION_REQUEST) {
    if (!embeddebApp.state) {
      const appUrl = `${chrome.extension.getURL('index.html')}?sessionId=${request.id}`;
      embeddebApp.load(appUrl);
    } else {
      embeddebApp.unload();
    }
  }
}

import { FeedParser } from '../packages/feed';

FeedParser.parse('http://manhua.dmzj.com/y/yiquanchaoren/rss.xml').then((feed) => {
  console.log(feed);
});
