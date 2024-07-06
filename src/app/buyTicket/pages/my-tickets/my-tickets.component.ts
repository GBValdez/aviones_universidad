import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss',
})
export class MyTicketsComponent implements OnInit {
  idFly: number = 0;

  constructor(private routerAct: ActivatedRoute) {}
  ngOnInit(): void {
    this.idFly = this.routerAct.snapshot.params['id'];
  }
}
