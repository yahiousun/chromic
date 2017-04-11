import { TestBed, inject } from '@angular/core/testing';

import { I18nService } from './i18n.service';

describe('RpcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService]
    });
  });

  it('should ...', inject([I18nService], (service: I18nService) => {
    expect(service).toBeTruthy();
  }));
});
