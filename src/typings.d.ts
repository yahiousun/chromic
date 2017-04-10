/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/* JSON-RPC */
declare namespace JSONRPC {
  export interface RequestObject {
    jsonrpc: string;
    method: string;
    params?: any;
    id?: string;
  }
  export interface ResponseObject {
    jsonrpc: string;
    id: string;
    result?: any;
    error?: ErrorObject;
  }
  export interface ErrorObject {
    code: number;
    message: string;
    data?: any;
  }
}
