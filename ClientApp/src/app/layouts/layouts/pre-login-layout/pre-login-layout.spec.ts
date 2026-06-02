import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLoginLayout } from './pre-login-layout';

describe('PreLoginLayout', () => {
  let component: PreLoginLayout;
  let fixture: ComponentFixture<PreLoginLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreLoginLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(PreLoginLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
