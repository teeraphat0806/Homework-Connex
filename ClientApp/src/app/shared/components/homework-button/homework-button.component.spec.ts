import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkButtonComponent } from './homework-button.component';

describe('HomeworkButtonComponent', () => {
  let component: HomeworkButtonComponent;
  let fixture: ComponentFixture<HomeworkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
