import { v4 } from 'uuid';
import { BackgroundRequestMessageService, MethodType } from '../packages/request-message-service';
import { FeedFinder, FeedParser } from '../packages/feed';
import db from './database';
import { Feed } from './database/model';

const messageService = new BackgroundRequestMessageService();

chrome.browserAction.onClicked.addListener((tab) => {
  messageService.request({
    id: v4(),
    to: tab.id,
    method: MethodType.SESSION_REQUEST,
    params: {
      url: tab.url
    }
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
      FeedFinder
        .find(request.params.url)
        .then(async (url: string) => {
          return db.feeds.get(url);
        })
        .then((feed: Feed) => {
          console.log('feed', feed);
          messageService.respond({
            id: request.id,
            to: request.from,
            result: feed
          });
        })
        .catch((e) => {
          messageService.respond({
            id: request.id,
            to: request.from,
            error: {
              code: -32603,
              message: 'No data',
              data: e
            }
          });
        });
      break;
    }
  }
}
