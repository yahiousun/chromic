import RequestMessageService from './request-message-service';

class ContentRequestMessageService {
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
      const callback:RequestMessageService.RequestCallback = this.callbacks.has(message.id) && this.callbacks.get(message.id);
      if (callback) {
        this.callbacks.delete(message.id);
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
    this.callbacks.set(message.id, callback);
    chrome.runtime.sendMessage(message);
    return this;
  }
  public forward(message: RequestMessageService.RequestObject, callback: RequestMessageService.RequestCallback) {
    const request = { ...message, method:`forward/${message.method}` };
    return this.request(request, callback);
  }
  public abort(requestMessageId: string) {
    if (this.callbacks.has(requestMessageId)) {
      this.callbacks.delete(requestMessageId);
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
