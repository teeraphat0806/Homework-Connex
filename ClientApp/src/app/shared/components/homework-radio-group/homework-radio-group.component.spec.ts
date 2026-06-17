import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkRadioGroupComponent } from './homework-radio-group.component';

describe('HomeworkRadioGroupComponent', () => {
  let component: HomeworkRadioGroupComponent;
  let fixture: ComponentFixture<HomeworkRadioGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkRadioGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkRadioGroupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
