import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categorymaster } from './categorymaster';

describe('Categorymaster', () => {
  let component: Categorymaster;
  let fixture: ComponentFixture<Categorymaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categorymaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Categorymaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
