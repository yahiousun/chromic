import RequestMessageService from './request_message_service';

class BackgroundRequestMessageService {
  public onrequest: RequestMessageService.RequestHandler;
  public onresponse: RequestMessageService.RequestCallback;
  public onnotification: RequestMessageService.RequestHandler;
  private _callbacks: Map<string, RequestMessageService.RequestCallback>;
  constructor() {
    this._callbacks = new Map();
    chrome.runtime.onMessage.addListener(this._onmessage);
  }
  private _onmessage = (message: any, sender: chrome.runtime.MessageSender) => {
    if (!message.id) {
      // Handle Notification
      if (this.onnotification) {
        const tabId = ((sender.tab && sender.tab.id) ? sender.tab.id : Number(sender.id));
        const notification = { ...message, from: tabId };
        this.onnotification(notification);
      }
    } else if (message && message.id && !message.method) {
      // Handle Response
      const callback: RequestMessageService.RequestCallback = this._callbacks.has(message.id) && this._callbacks.get(message.id);
      if (callback) {
        this._callbacks.delete(message.id);
        callback(message);
      }
    } else {
      const tabId = ((sender.tab && sender.tab.id) ? sender.tab.id : Number(sender.id));
      const request = { ...message, from: tabId };
      // Handle Resquest
      if (/^forward\//.test(message.method)) {
        this.request(request, (response) => {
          this.respond({ ...response, to: request.from });
        });
      } else if (this.onrequest) {
        this.onrequest(request);
      }
    }
  }
  public request(message: RequestMessageService.RequestObject, callback: RequestMessageService.RequestCallback) {
    this._callbacks.set(message.id, callback);
    chrome.tabs.sendMessage(message.to, message);
    return this;
  }
  public abort(msgId: string) {
    if (this._callbacks.has(msgId)) {
      this._callbacks.delete(msgId);
    }
    return this;
  }
  public notify(tabId: number, message: RequestMessageService.RequestObject) {
    chrome.tabs.sendMessage(tabId, message);
    return this;
  }
  public respond(message: RequestMessageService.ResponseObject) {
    console.log('send respond', message)
    chrome.tabs.sendMessage(message.to, message);
    return this;
  }
}

export default BackgroundRequestMessageService;
