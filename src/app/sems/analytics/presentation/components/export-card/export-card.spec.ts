import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCard } from './export-card';

describe('ExportCard', () => {
  let component: ExportCard;
  let fixture: ComponentFixture<ExportCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
