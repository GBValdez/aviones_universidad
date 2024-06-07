import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DestinationsHomeComponent } from './destinations/pages/destinations-home/destinations-home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, DestinationsHomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private matDialog: MatDialog) {}
  ngOnInit(): void {
    // this.matDialog.open(DestinationsHomeComponent, {
    //   width: '60%',
    //   minWidth: '280px',
    // });
  }

  title = 'aviones_aeropuerto';
}
