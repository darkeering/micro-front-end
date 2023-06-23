import { TestBed } from '@angular/core/testing';

import { ReqResInterceptor } from './req-res.interceptor';

describe('ReqResInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ReqResInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ReqResInterceptor = TestBed.inject(ReqResInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
