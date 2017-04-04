import { ContentRequestMessageService, MethodType } from '../packages/request-message-service';
import Embeddeb, { DONE } from '../packages/embeddeb';

const messageService = new ContentRequestMessageService();
const embeddebApp = new Embeddeb();

messageService.onrequest = (request) => {
  if (request.method === MethodType.SESSION_REQUEST) {
    if (!embeddebApp.state) {
      const params = new URLSearchParams();
      // Typescript 2.2 bug, searchParams
      params.set('id', request.id);
      params.set('ref', request.params.url);
      const appUrl = new URL(`${chrome.extension.getURL('index.html')}?${params.toString()}`);
      // appUrl.searchParams.set('ref', 'request.params.url');
      embeddebApp.load(appUrl.toString());
    } else {
      embeddebApp.unload();
    }
  }
};
