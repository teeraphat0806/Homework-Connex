import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderdetailadmin } from './orderdetailadmin';

describe('Orderdetailadmin', () => {
  let component: Orderdetailadmin;
  let fixture: ComponentFixture<Orderdetailadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderdetailadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(Orderdetailadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
