import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import { ContentRequestMessageService, MethodType } from './packages/request-message-service';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

// const messageService = new ContentRequestMessageService();

// const params = window.location.search.split('?')[1];

// const sessionId = params.split('=')[1];

// messageService.respond({
//   jsonrpc: '2.0',
//   id: sessionId,
//   result: 'Application Start'
// });
