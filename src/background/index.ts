import { v4 } from 'uuid';
import { BackgroundRequestMessageService, MethodType } from '../packages/request-message-service';
import { FeedFinder, FeedParser } from '../packages/feed';

const messageService = new BackgroundRequestMessageService();

chrome.browserAction.onClicked.addListener((tab) => {
  messageService.request({
    id: v4(),
    to: tab.id,
    method: MethodType.SESSION_REQUEST
  }, (response) => {
    console.log(response);
    // Reader loaded
    if (response.result) {
      // FeedFinder.find(tab.url).then((url: string) => {
        
      // },
      // () => {
      //   console.log('Feed Not Found');
      // });
    }
  });
});

messageService.onrequest = (request) => {
  console.log('request', request);
  switch (request.method) {
    case MethodType.INITIALIZE: {
      messageService.respond({
        id: request.id,
        to: request.from,
        result: 'No data'
      });
    }
  }
}
