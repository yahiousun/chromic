import { Component } from '@angular/core';

import { RPCService } from './rpc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RPCService]
})
export class AppComponent {
  title = 'app works!';
  response = '';
  constructor(private rpc: RPCService) {
    this.rpc.initialize().then((response) => {
      this.response = response;
    });
  }
}
