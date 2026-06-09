import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloginNavbarComponent } from './prelogin-navbar.component';

describe('PreloginNavbarComponent', () => {
  let component: PreloginNavbarComponent;
  let fixture: ComponentFixture<PreloginNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreloginNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreloginNavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
