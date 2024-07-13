import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassangerPerFlightComponent } from './passanger-per-flight.component';

describe('PassangerPerFlightComponent', () => {
  let component: PassangerPerFlightComponent;
  let fixture: ComponentFixture<PassangerPerFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassangerPerFlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PassangerPerFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
