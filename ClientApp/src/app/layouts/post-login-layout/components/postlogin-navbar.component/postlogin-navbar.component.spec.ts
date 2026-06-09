import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostloginNavbarComponent } from './postlogin-navbar.component';

describe('PostloginNavbarComponent', () => {
  let component: PostloginNavbarComponent;
  let fixture: ComponentFixture<PostloginNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostloginNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostloginNavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
