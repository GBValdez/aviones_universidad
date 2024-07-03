import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  modalFinishSeatInterface,
  mySeatPosInterface,
} from '@plane/interfaces/plane.interface';

@Component({
  selector: 'app-selct-finish-modal',
  standalone: true,
  imports: [MatCardModule, MatDialogModule, MatTableModule],
  templateUrl: './selct-finish-modal.component.html',
  styleUrl: './selct-finish-modal.component.scss',
})
export class SelctFinishModalComponent {
  displayedColumns: string[] = ['codigo', 'clase', 'precio'];
  dataSource = new MatTableDataSource<mySeatPosInterface>(this.data.mySeats);
  constructor(@Inject(MAT_DIALOG_DATA) public data: modalFinishSeatInterface) {}
  getPrice(seat: mySeatPosInterface): number {
    return this.data.clases.find((x) => x.clase.id === seat.clase.id!)?.precio!;
  }
}
