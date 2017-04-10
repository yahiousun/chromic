import { v4 } from 'uuid';
import { RPCTimeoutError } from '../core/util';

export type SandboxRequestCallback = (response: JSONRPC.ResponseObject) => void;
export const JSON_RPC = '2.0';

class Sandbox {
  public ref: HTMLIFrameElement;
  public callbacks: Map<string, SandboxRequestCallback>;
  constructor(selector: string) {
    // Get Sandbox iframe
    this.ref = <HTMLIFrameElement>document.querySelector(selector);
    this.callbacks = new Map();
    if (!this.ref) {
      throw new Error('Sandbox Not Found');
    }
    // Listen message
    window.addEventListener('message', (e) => {
      const { data } = e;
      if (data.id && this.callbacks.has(data.id)) {
        const callback = this.callbacks.get(data.id);
        callback(data);
        this.callbacks.delete(data.id);
      }
    });
  }
  public async eval(source: string, context?: any) {
    return this.request({
      jsonrpc: JSON_RPC,
      id: v4(),
      method: 'eval',
      params: {
        source: source,
        context: context || null
      }
    });
  }
  public async request(request: JSONRPC.RequestObject) {
    return new Promise((resolve, reject) => {
      // Add callback
      this.onrespond(request.id, (response) => {
        if (!response.error) {
          resolve(response.result);
        } else {
          reject(response.error);
        }
      });
      // Send JSON-RPC request
      this.ref.contentWindow.postMessage(request, '*');
      // Reject on timeout
      setTimeout(() => {
        reject(RPCTimeoutError);
      }, 3000);
    });
  }
  public onrespond(id: string, callback: SandboxRequestCallback) {
    this.callbacks.set(id, callback);
    return this;
  }
};

export default Sandbox;
