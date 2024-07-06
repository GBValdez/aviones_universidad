import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TackleTicketComponent } from './tackle-ticket.component';

describe('TackleTicketComponent', () => {
  let component: TackleTicketComponent;
  let fixture: ComponentFixture<TackleTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TackleTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TackleTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
