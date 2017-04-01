import RequestMessageService from './request-message-service';

class BackgroundRequestMessageService {
  public onrequest: RequestMessageService.RequestHandler;
  public onresponse: RequestMessageService.RequestCallback;
  public onnotification: RequestMessageService.RequestHandler;
  private callbacks: Map<string, RequestMessageService.RequestCallback>;
  constructor() {
    this.callbacks = new Map();
    chrome.runtime.onMessage.addListener(this.onmessage);
  }
  private onmessage = (message: any, sender: chrome.runtime.MessageSender) => {
    if (!message.id) {
      // Handle Notification
      if (this.onnotification) {
        this.onnotification(message);
      }
    } else if (message && message.id && !message.method) {
      // Handle Response
      const callback: RequestMessageService.RequestCallback = this.callbacks.has(message.id) && this.callbacks.get(message.id);
      if (callback) {
        this.callbacks.delete(message.id);
        callback(message);
      }
    } else {
      // Handle Resquest
      if (/^forward\//.test(message.method)) {
        const tabId = ((sender.tab && sender.tab.id) ? sender.tab.id : Number(sender.id));
        this.request(tabId, message, (response) => {
          this.respond(tabId, response);
        });
      } else if (this.onrequest) {
        this.onrequest(message);
      }
    }
  }
  public request(tabId: number, message: RequestMessageService.RequestObject, callback: RequestMessageService.RequestCallback) {
    this.callbacks.set(message.id, callback);
    chrome.tabs.sendMessage(tabId, message);
    return this;
  }
  public abort(requestMessageId: string) {
    if (this.callbacks.has(requestMessageId)) {
      this.callbacks.delete(requestMessageId);
    }
    return this;
  }
  public notify(tabId: number, message: RequestMessageService.RequestObject) {
    chrome.tabs.sendMessage(tabId, message);
    return this;
  }
  public respond(tabId: number, message: RequestMessageService.ResponseObject) {
    chrome.tabs.sendMessage(tabId, message);
    return this;
  }
}

export default BackgroundRequestMessageService;
