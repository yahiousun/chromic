import { TestBed, inject } from '@angular/core/testing';

import { RPCService } from './rpc.service';

describe('RpcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RPCService]
    });
  });

  it('should ...', inject([RPCService], (service: RPCService) => {
    expect(service).toBeTruthy();
  }));
});
