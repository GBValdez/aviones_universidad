import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportFormComponent } from './airport-form.component';

describe('AirportFormComponent', () => {
  let component: AirportFormComponent;
  let fixture: ComponentFixture<AirportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
