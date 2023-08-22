import { TestBed } from '@angular/core/testing';

import { CheckoutSendToDbService } from './checkout-send-to-db.service';

describe('CheckoutSendToDbService', () => {
  let service: CheckoutSendToDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutSendToDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
