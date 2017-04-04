namespace RequestMessageService {
  export interface RequestObject {
    method: string;
    from?: number;
    to?: number;
    params?: any;
    id?: string;
  }

  export interface ResponseObject {
    to?: number;
    result?: any;
    error?: any;
    id: string;
  }

  export interface ErrorObject {
    code: number;
    message: string;
    data?: any;
  }

  export type RequestCallback = (response: ResponseObject) => void;

  export type RequestHandler = (request: RequestObject) => void;
}

export default RequestMessageService;
