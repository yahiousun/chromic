import { Injectable } from '@angular/core';

@Injectable()
export class I18nService {
  public message(name) {
    return chrome.i18n.getMessage(name);
  }
}
