import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdParty } from './third-party';

describe('ThirdParty', () => {
  let component: ThirdParty;
  let fixture: ComponentFixture<ThirdParty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdParty],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdParty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
