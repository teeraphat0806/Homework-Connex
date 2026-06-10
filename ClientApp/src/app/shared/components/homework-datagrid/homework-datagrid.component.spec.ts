import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkDatagridComponent } from './homework-datagrid.component';

describe('HomeworkDatagridComponent', () => {
  let component: HomeworkDatagridComponent;
  let fixture: ComponentFixture<HomeworkDatagridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkDatagridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkDatagridComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
