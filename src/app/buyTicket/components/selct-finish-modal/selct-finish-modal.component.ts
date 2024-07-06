import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  modalFinishSeatInterface,
  mySeatPosInterface,
} from '@plane/interfaces/plane.interface';
import { MatButtonModule } from '@angular/material/button';
import { VueloService } from '@buyTicket/services/vuelo.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-selct-finish-modal',
  standalone: true,
  imports: [MatCardModule, MatDialogModule, MatTableModule, MatButtonModule],
  templateUrl: './selct-finish-modal.component.html',
  styleUrl: './selct-finish-modal.component.scss',
})
export class SelctFinishModalComponent {
  displayedColumns: string[] = ['codigo', 'clase', 'precio'];
  dataSource = new MatTableDataSource<mySeatPosInterface>(this.data.mySeats);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: modalFinishSeatInterface,
    private vueloSvc: VueloService,
    private acRoute: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialogRef<SelctFinishModalComponent>
  ) {}
  getPrice(seat: mySeatPosInterface): number {
    return this.data.clases.find((x) => x.clase.id === seat.clase.id!)?.precio!;
  }

  getTotalPrice(): number {
    return this.data.mySeats.reduce(
      (acc, seat) =>
        acc +
        this.data.clases.find((x) => x.clase.id === seat.clase.id!)?.precio!,
      0
    );
  }
  async pay() {
    const RES = await Swal.fire({
      title: '¿Desea pagar los asientos seleccionados?',
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      cancelButtonText: 'Cancelar',
    });
    if (RES.isConfirmed) {
      const seats = this.data.mySeats.map((x) => x.Id!);
      this.vueloSvc.payFly(this.data.idVuelo, seats, async () => {
        await Swal.fire('Pago exitoso', 'Pago realizado con éxito', 'success');
        this.router.navigate(['/my-tickets', this.data.idVuelo]);
        this.dialogRef.close();
        await Swal.fire({
          title: 'Nota',
          text: "Puede descargar sus boletos presionando el botón 'Acciones' y luego 'Descargar boleto'",
          icon: 'info',
          timer: 7000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      });
    }
  }
}
