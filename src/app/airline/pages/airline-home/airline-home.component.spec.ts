import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineHomeComponent } from './airline-home.component';

describe('AirlineHomeComponent', () => {
  let component: AirlineHomeComponent;
  let fixture: ComponentFixture<AirlineHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirlineHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirlineHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
