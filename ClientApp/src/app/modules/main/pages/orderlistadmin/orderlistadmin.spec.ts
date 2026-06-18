import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderlistadmin } from './orderlistadmin';

describe('Orderlistadmin', () => {
  let component: Orderlistadmin;
  let fixture: ComponentFixture<Orderlistadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderlistadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(Orderlistadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
