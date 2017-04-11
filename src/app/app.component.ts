import { Component } from '@angular/core';

import { I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [I18nService]
})
export class AppComponent {
  title = 'app works!';
  constructor(private i18n: I18nService) {
  }
  public log() {
    console.log(123)
  }
}
