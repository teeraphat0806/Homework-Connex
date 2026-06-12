import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkFormpopupComponent } from './homework-formpopup.component';

describe('HomeworkFormpopupComponent', () => {
  let component: HomeworkFormpopupComponent;
  let fixture: ComponentFixture<HomeworkFormpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkFormpopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkFormpopupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
