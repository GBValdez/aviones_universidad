import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineSectionComponent } from './airline-section.component';

describe('AirlineSectionComponent', () => {
  let component: AirlineSectionComponent;
  let fixture: ComponentFixture<AirlineSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirlineSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirlineSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
