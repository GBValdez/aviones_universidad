import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Router } from '@angular/router';
import { vueloClaseDto, vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { mySeatPosInterface } from '@plane/interfaces/plane.interface';
import { boletoDto, ticketBodyDto } from '@plane/interfaces/seats.interface';
import { TackleTicketService } from '@tackleTicket/services/tackle-ticket.service';
import { clientedto } from '@user/interface/user.interface';
import { OnlyNumberInputDirective } from '@utils/directivas/only-number-input.directive';
import { LocalTimezonePipe } from '@utils/pipes/local-timezone-pipe.pipe';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tackle-ticket',
  standalone: true,
  imports: [
    ZXingScannerModule,
    NgClass,
    MatCardModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    OnlyNumberInputDirective,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './tackle-ticket.component.html',
  styleUrl: './tackle-ticket.component.scss',
  providers: [LocalTimezonePipe],
})
export class TackleTicketComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<boletoDto>;

  ticketEncrypted?: string;
  client?: clientedto;
  fly?: vueloDto;
  displayedColumns: string[] = [
    'codigo',
    'clase',
    'precio',
    'cantMaxMaletas',
    'cantDeMaletas',
    'recargo',
  ];
  dataSource = new MatTableDataSource<boletoDto>([]);
  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  constructor(
    private route: Router,
    private tackleSvc: TackleTicketService,
    private localTimezonePipe: LocalTimezonePipe,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    // this.ticketEncrypted = '';
    // this.scanner.scanStop();
  }
  cameras: MediaDeviceInfo[] = [];
  selectedCamera!: MediaDeviceInfo;
  form: FormArray = this.fb.array([]);

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.cameras = devices;
    if (devices.length > 0) {
      this.selectedCamera = devices[0];
    }
  }

  getVueloClase(seat: boletoDto): vueloClaseDto {
    return this.fly?.vueloClases.find(
      (x) => x.clase.id === seat.asiento?.clase.id
    )!;
  }
  async handleQrCodeResult(resultString: string) {
    await Swal.fire({
      title: 'Boleto escaneado',
      icon: 'success',
    });
    this.tackleSvc.getInfoTicket(resultString).subscribe((res) => {
      if (res) {
        this.ticketEncrypted = resultString;
        this.scanner.scanStop();

        Swal.fire({
          title: 'Boleto encontrado',
          icon: 'success',
        });
        this.client = res.cliente;
        this.fly = res.vuelo;

        this.fly.fechaLlegada = new Date(
          this.localTimezonePipe.transform(this.fly.fechaLlegada.toString())
        );
        this.fly.fechaSalida = new Date(
          this.localTimezonePipe.transform(this.fly.fechaSalida.toString())
        );
        this.dataSource.data = res.boletos;
        res.boletos.forEach((boleto) => {
          this.form.push(
            this.fb.group({
              codigo: boleto.codigo,
              cantidadDeMaletas: [null, [Validators.required]],
            })
          );
        });
        // this.table.renderRows();
      } else {
        Swal.fire({
          title: 'Boleto no encontrado',
          icon: 'error',
        });
      }
    });
  }

  cleanInfo(): void {
    this.fly = undefined;
    this.client = undefined;
    this.ticketEncrypted = undefined;
    this.dataSource.data = [];
    this.form.clear();
    this.scanner.scanStart();
  }
  async tackle() {
    let message = 'Esta seguro de abordar los boletos';
    if (this.calculateTotal() > 0) {
      message += `, se le cobrara un recargo de Q${this.calculateTotal()}`;
    }
    const alert = await Swal.fire({
      text: message,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      showConfirmButton: true,
      confirmButtonText: 'Si',
    });
    if (alert.isConfirmed) {
      const DATA: ticketBodyDto[] = this.form.value;
      this.tackleSvc
        .completeTicket(this.ticketEncrypted!, DATA)
        .subscribe(() => {
          Swal.fire({
            text: 'Los boletos han sido abordados',
            icon: 'success',
          });
          this.cleanInfo();
        });
    }
  }
  getFormGroup(code: string) {
    return this.form.controls.find((x) => x.value.codigo === code) as FormGroup;
  }

  calculateRecargo(element: boletoDto): number {
    const form = this.getFormGroup(element.codigo);
    const cant = form.get('cantidadDeMaletas')?.value;
    const clase = this.getVueloClase(element);
    if (cant > clase.cantidadMaletasMax) {
      const diff = cant - clase.cantidadMaletasMax;
      return diff * 50;
    }
    return 0;
  }
  calculateTotal(): number {
    let total = 0;
    this.dataSource.data.forEach((element) => {
      total += this.calculateRecargo(element);
    });
    return total;
  }
}
