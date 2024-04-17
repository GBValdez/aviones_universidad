import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatItemComponent } from './seat-item.component';

describe('SeatItemComponent', () => {
  let component: SeatItemComponent;
  let fixture: ComponentFixture<SeatItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeatItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
