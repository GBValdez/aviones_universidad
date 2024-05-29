import { Component } from '@angular/core';
import { SelectSeatComponent } from '@buyTicket/components/select-seat/select-seat.component';

@Component({
  selector: 'app-buy-ticket',
  standalone: true,
  imports: [SelectSeatComponent],
  templateUrl: './buy-ticket.component.html',
  styleUrl: './buy-ticket.component.scss',
})
export class BuyTicketComponent {}
