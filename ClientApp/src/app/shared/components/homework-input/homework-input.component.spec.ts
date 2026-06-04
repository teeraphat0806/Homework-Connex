import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkInputComponent } from './homework-input.component';

describe('HomeworkInputComponent', () => {
  let component: HomeworkInputComponent;
  let fixture: ComponentFixture<HomeworkInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
