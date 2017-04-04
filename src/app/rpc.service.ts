import { Injectable } from '@angular/core';
import { v4 } from 'uuid';

import { ContentRequestMessageService, MethodType } from '../packages/request-message-service';

@Injectable()
export class RPCService {
  public channel: ContentRequestMessageService;
  constructor() {
    this.channel = new ContentRequestMessageService();

    const params = window.location.search.split('?')[1];
    const id = (params && params.split('=')[1]);

    this.channel.respond({
      id: id,
      result: id
    });
  }
  public async initialize() {
    return new Promise<any>((resolve, reject) => {
      this.channel.request({
        id: v4(),
        method: MethodType.INITIALIZE,
        params: {
          url: location.href
        }
      }, (response) => {
        console.log('response', response);
        if (response.result) {
          resolve(response.result)
        }
        if (response.error) {
          reject(response.error);
        }
      });
    })
  }
}
