import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkDropdownComponent } from './homework-dropdown.component';

describe('HomeworkDropdownComponent', () => {
  let component: HomeworkDropdownComponent;
  let fixture: ComponentFixture<HomeworkDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkDropdownComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
