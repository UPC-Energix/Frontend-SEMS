import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyChart } from './weekly-chart';

describe('WeeklyChart', () => {
  let component: WeeklyChart;
  let fixture: ComponentFixture<WeeklyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
