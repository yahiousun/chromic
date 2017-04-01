import { v4 } from 'uuid';
import { BackgroundRequestMessageService, MethodType } from '../packages/request-message-service';

const messageService = new BackgroundRequestMessageService();

chrome.browserAction.onClicked.addListener((tab) => {
  messageService.request(tab.id, {
    jsonrpc: '2.0',
    id: v4(),
    method: MethodType.SESSION_REQUEST
  }, (response) => {
    console.log(response);
  });
});
