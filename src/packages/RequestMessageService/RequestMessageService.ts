namespace RequestMessageService {
  export interface RequestObject {
    jsonrpc: string;
    method: string;
    params?: any;
    id?: string;
  }

  export interface ResponseObject {
    jsonrpc: string;
    result?: any;
    error?: any;
    id: string;
  }

  export interface ErrorObject {
    code: number;
    message: string;
    data?: any;
  }

  export interface RequestCallback {
    (response: ResponseObject): void;
  }

  export interface RequestHandler {
    (request: RequestObject): void;
  }
}

export default RequestMessageService;
