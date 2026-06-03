import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLoginLayout } from './post-login-layout';

describe('PostLoginLayout', () => {
  let component: PostLoginLayout;
  let fixture: ComponentFixture<PostLoginLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLoginLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(PostLoginLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
