import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderlist } from './orderlist';

describe('Orderlist', () => {
  let component: Orderlist;
  let fixture: ComponentFixture<Orderlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderlist],
    }).compileComponents();

    fixture = TestBed.createComponent(Orderlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
