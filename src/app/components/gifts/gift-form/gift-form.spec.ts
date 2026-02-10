import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftForm } from './gift-form';

describe('GiftForm', () => {
  let component: GiftForm;
  let fixture: ComponentFixture<GiftForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
