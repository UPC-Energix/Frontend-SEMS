import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceChart } from './device-chart';

describe('DeviceChart', () => {
  let component: DeviceChart;
  let fixture: ComponentFixture<DeviceChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
