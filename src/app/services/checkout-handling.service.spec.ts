import { TestBed } from '@angular/core/testing';

import { CheckoutHandlingService } from './checkout-handling.service';

describe('CheckoutHandlingService', () => {
  let service: CheckoutHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
