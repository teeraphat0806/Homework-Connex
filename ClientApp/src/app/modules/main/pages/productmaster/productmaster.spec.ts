import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productmaster } from './productmaster';

describe('Productmaster', () => {
  let component: Productmaster;
  let fixture: ComponentFixture<Productmaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productmaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Productmaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
