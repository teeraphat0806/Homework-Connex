import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comunicate } from './comunicate';

describe('Comunicate', () => {
  let component: Comunicate;
  let fixture: ComponentFixture<Comunicate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comunicate],
    }).compileComponents();

    fixture = TestBed.createComponent(Comunicate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
