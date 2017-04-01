import RequestMessageService from './request_message_service';

class ContentRequestMessageService {
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
        this.onnotification(message);
      }
    } else if (message && message.id && !message.method) {
      // Handle Response
      const callback: RequestMessageService.RequestCallback = this._callbacks.has(message.id) && this._callbacks.get(message.id);
      if (callback) {
        this._callbacks.delete(message.id);
        callback(message);
      }
    } else {
      // Handle Resquest
      if (this.onrequest) {
        // Handle forwarded request
        const request = { ...message, method: message.method.replace(/^forward\//, '') };
        this.onrequest(request);
      }
    }
  }
  public request(message: RequestMessageService.RequestObject, callback: RequestMessageService.RequestCallback) {
    this._callbacks.set(message.id, callback);
    chrome.runtime.sendMessage(message);
    return this;
  }
  public forward(message: RequestMessageService.RequestObject, callback: RequestMessageService.RequestCallback) {
    const request = { ...message, method:`forward/${message.method}` };
    return this.request(request, callback);
  }
  public abort(msgId: string) {
    if (this._callbacks.has(msgId)) {
      this._callbacks.delete(msgId);
    }
    return this;
  }
  public notify(message: RequestMessageService.RequestObject) {
    chrome.runtime.sendMessage(message);
    return this;
  }
  public respond(message: RequestMessageService.ResponseObject) {
    chrome.runtime.sendMessage(message);
    return this;
  }
}

export default ContentRequestMessageService;
