import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { v4 } from 'uuid';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ContentRequestMessageService, MethodType } from './packages/request-message-service';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

const messageService = new ContentRequestMessageService();

const params = window.location.search.split('?')[1];
const id = (params && params.split('=')[1]);

messageService.respond({
  id: id,
  result: id
});

messageService.request({
  id: v4(),
  method: MethodType.INITIALIZE
}, (response) => {
  console.log('response', response);
  if (response.result) {
    console.log('find data', response.result);
  }
  if (response.error) {
    console.log('error', response.error);
  }
});
