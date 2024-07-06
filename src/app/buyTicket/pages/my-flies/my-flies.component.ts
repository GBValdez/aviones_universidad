import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';

@Component({
  selector: 'app-my-flies',
  standalone: true,
  imports: [MatCardModule, NgClass, DatePipe, RouterModule],
  templateUrl: './my-flies.component.html',
  styleUrl: './my-flies.component.scss',
})
export class MyFliesComponent implements OnInit {
  currentDate = new Date();
  constructor(private vueloSvc: VueloService) {}
  ngOnInit(): void {
    this.vueloSvc.getMyFlies().subscribe((res) => {
      this.myFlies = res;
    });
  }
  myFlies: vueloDto[] = [];
}
