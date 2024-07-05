import { NgClass, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import {
  selectVueloDto,
  vueloClaseDto,
} from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';
import {
  modalFinishSeatInterface,
  mySeatPosInterface,
  posInterface,
  seatPosInterface,
} from '@plane/interfaces/plane.interface';
import { PlaneService } from '@plane/services/plane.service';
import { SeatsService } from '@plane/services/seats.service';
import { SelctFinishModalComponent } from '../selct-finish-modal/selct-finish-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { boletoDto } from '@plane/interfaces/seats.interface';
import Swal from 'sweetalert2';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-select-seat',
  standalone: true,
  imports: [
    NgClass,
    MatIconModule,
    MatButtonModule,
    NgStyle,
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule,
    SelctFinishModalComponent,
    MatMenuModule,
  ],
  templateUrl: './select-seat.component.html',
  styleUrl: './select-seat.component.scss',
})
export class SelectSeatComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    private routerAct: ActivatedRoute,
    private planeService: PlaneService,
    private http: HttpClient,
    private seatSvc: SeatsService,
    private vueloSvc: VueloService,
    private router: Router,
    private authSvc: AuthService,
    private matDialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.vueloSvc.leaveGroup(this.idFly);
    if (this.intervalToolTip) {
      clearTimeout(this.intervalToolTip);
    }
  }

  exit() {
    this.vueloSvc.leaveGroup(this.idFly);
    this.router.navigate(['/session/searchFlight']);
  }

  ngOnInit(): void {
    this.clientId = this.authSvc.getAuth()?.clientId || 0;
    this.vueloSvc.startConnection().then(() => {
      this.vueloSvc.joinGroup(this.idFly);
      this.vueloSvc.addReceiveSeatSelection();
    });
    this.idFly = this.routerAct.snapshot.params['id'];

    this.vueloSvc.getSeat().subscribe((res) => {
      if (res) {
        this.makeListSeats(res);
      }
    });
  }
  makeListSeats(tickets: boletoDto[]): void {
    this.seats.forEach((seat) => {
      const ticket = tickets.find((t) => t.asientoId == seat.Id);
      if (ticket) {
        seat.Estado = ticket.estadoBoleto;
        seat.clienteId = ticket.clienteId;
        return;
      }
      seat.Estado = { id: 94, name: 'Libre', description: 'Libre' };
    });
    this.mySeats = this.seats.filter(
      (seat) => seat.clienteId == this.clientId && seat.Estado?.id != 94
    );
    this.mySeats.forEach((seat) => {
      seat.checked = false;
    });
  }

  validOption(): boolean {
    return this.mySeats.some((seat) => seat.checked);
  }

  async vacateSeat() {
    const SEATS = this.mySeats.filter((seat) => seat.checked);

    const seatsId: number[] = SEATS.filter((seat) => seat.Estado?.id == 93).map(
      (seat) => seat.Id!
    );

    if (seatsId.length == 0) {
      Swal.fire(
        'Error',
        'No hay ningun asiento apartado seleccionado',
        'error'
      );
      return;
    }
    if (SEATS.some((seat) => seat.Estado?.id == 92))
      Swal.fire(
        'Advertencia',
        'Solo se desocuparan los asientos apartados , en los pagados no surtirá ningún efecto',
        'warning'
      );

    const RES = await Swal.fire({
      title: '¿Desea desocupar los asientos seleccionados?',
      showCancelButton: true,
      confirmButtonText: 'Desocupar',
      cancelButtonText: 'Cancelar',
      icon: 'question',
    });
    if (!RES.isConfirmed) return;
    this.vueloSvc.vacateSeats(this.idFly, seatsId, () => {
      this.mySeats = this.mySeats.filter(
        (seat) => seat.checked == undefined || seat.checked == false
      );
    });
  }

  intervalToolTip: any = null;
  showTooltip() {
    this.modeVisualization = 2;
    this.mySeats.forEach((seat) => {
      if (seat.checked) {
        seat.tooltip?.show();
      }
    });
    if (this.intervalToolTip) {
      clearTimeout(this.intervalToolTip);
      this.intervalToolTip = null;
    }

    this.intervalToolTip = setTimeout(() => {
      this.mySeats.forEach((seat) => {
        seat.tooltip?.hide();
      });
    }, 2000);
  }

  addTooltip(seat: seatPosInterface, tooltip: MatTooltip) {
    seat.tooltip = tooltip;
    // console.log('tooltip');
  }

  sendSeat(seat: seatPosInterface) {
    // console.log('myseats', this.mySeats);
    if (seat.Estado?.id == 93 && seat.clienteId != this.clientId) return;
    if (seat.Estado?.id == 92) return;
    const SEAT_DTO: selectVueloDto = {
      VueloId: this.idFly,
      AsientoId: seat.Id!,
    };

    this.vueloSvc.sendSeat(SEAT_DTO);
  }

  ngAfterViewInit(): void {
    this.uploadBase();
    this.seatSvc.getByFly(this.idFly).subscribe((res) => {
      this.clasesList = res.classList;
      this.seats = res.asientoDtos.map((seat) => {
        const [x, y] = seat.posicion.split('|').map(Number);
        // console.log(seat);
        return {
          position: { x, y },
          clase: seat.clase,
          Id: seat.id,
          Codigo: seat.codigo,
        };
      });
      this.makeListSeats(res.boletos);
      this.sizeWidth = res.avion.tamAsientoPorc;
      this.resizeSeat();
    });
  }

  uploadBase() {
    this.planeService.getImgBase().subscribe((res) => {
      console.log(res);
      this.uploadFile(res);
    });
  }
  clasesList: vueloClaseDto[] = [];
  wScreen: number = window.innerWidth;
  hScreen: number = window.innerHeight;
  zoom: WritableSignal<number> = signal(1);
  translatePos: posInterface = { x: 0, y: 0 };
  seats: seatPosInterface[] = [];
  mySeats: mySeatPosInterface[] = [];
  sizePixelSize: number = 10;
  sizeWidth: number = 0;
  closeSidenav: boolean = false;
  idFly: number = 0;
  timeOutSize: any;
  posOrigin?: posInterface;
  clientId: number = 0;
  modeVisualization: number = 0;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  img: any = null;
  keepClicking: boolean = false;
  getPrice(seat: seatPosInterface): number {
    return (
      this.clasesList.find((c) => c.clase.id == seat.clase.id)?.precio || 0
    );
  }

  getTotal(): number {
    return this.mySeats.reduce((acc, seat) => acc + this.getPrice(seat), 0);
  }
  async uploadFile(event: Blob) {
    if (event) {
      this.img = URL.createObjectURL(event);
    }
    if (this.timeOutSize) clearTimeout(this.timeOutSize);
    this.timeOutSize = setTimeout(() => {
      this.resizePlane();
      this.resizeSeat();
    }, 2);
  }

  resizePlane() {
    this.wScreen = window.innerWidth;
    this.hScreen = window.innerHeight;
  }
  refresh() {
    this.zoom.set(1);
    this.translatePos = { x: 0, y: 0 };
  }

  //Presionar
  pressTouch(event: TouchEvent) {
    event.preventDefault();
    this.startInteraction(event.touches[0]);
  }

  pressClick(event: MouseEvent) {
    if (event.button == 0) this.startInteraction(event);
  }

  startInteraction(event: MouseEvent | Touch): void {
    this.keepClicking = true;
    this.navigationStart(event);
  }
  navigationStart(event: MouseEvent | Touch) {
    this.posOrigin = this.setPosition(event);
  }

  //Mover
  touchMove(event: TouchEvent) {
    if (event.changedTouches && event.changedTouches.length > 0)
      this.interactionMove(event.changedTouches[0], event);
  }
  mouseMove(event: MouseEvent) {
    this.interactionMove(event, event);
  }

  interactionMove(
    event: MouseEvent | Touch,
    evt: MouseEvent | TouchEvent
  ): void {
    evt.preventDefault();
    this.navigateMove(event);
  }
  //Soltar
  releaseClick(event: MouseEvent) {
    if (event.button == 0) this.endInteraction(event);
  }

  touchEnd(event: TouchEvent): void {
    if (event.changedTouches && event.changedTouches.length > 0) {
      this.endInteraction(event.changedTouches[0]);
    }
  }
  endInteraction(event: MouseEvent | Touch): void {
    this.keepClicking = false;
    this.navigateEnd();
  }
  //Click o touch en silla
  mousedown(event: MouseEvent, seat: seatPosInterface) {
    // if (event.button == 0) this.interactiveSeat(seat, event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.timeOutSize) clearTimeout(this.timeOutSize);
    this.resizePlane();
    this.resizeSeat();
  }
  setPosition(mouse: MouseEvent | Touch): posInterface {
    const rect = this.container.nativeElement.getBoundingClientRect();
    let x = mouse.pageX - rect.left - window.scrollX; // Posición relativa X dentro del elemento
    let y = mouse.pageY - rect.top - window.scrollY; // Posición relativa Y dentro del elemento
    x = x / this.zoom(); // Ajusta x por el factor de zoom
    y = y / this.zoom(); // Ajusta y por el factor de zoom
    x = (x * 100) / this.container.nativeElement.clientWidth;
    y = (y * 100) / this.container.nativeElement.clientHeight;
    return { x, y };
  }

  navigateMove(event: MouseEvent | Touch) {
    if (!this.keepClicking) return;
    if (!this.posOrigin) return;
    const pos = this.setPosition(event);
    this.translatePos = {
      x: this.translatePos.x + pos.x - this.posOrigin.x,
      y: this.translatePos.y + pos.y - this.posOrigin.y,
    };
  }
  navigateEnd() {
    this.posOrigin = undefined;
  }
  resizeSeat() {
    this.sizePixelSize =
      (this.sizeWidth / 100) * this.container.nativeElement.clientWidth;
  }
  finishSelect() {
    const data: modalFinishSeatInterface = {
      mySeats: this.mySeats.filter((seat) => seat.Estado?.id == 93),
      clases: this.clasesList,
      idVuelo: this.idFly,
    };
    this.matDialog.open(SelctFinishModalComponent, {
      data,
      width: '50%',
      minWidth: '280px',
    });
  }
  getIcon(seat: seatPosInterface): string {
    if (seat.Estado?.id == 94) return 'event_seat';
    if (seat.Estado?.id == 93 && seat.clienteId == this.clientId)
      return 'airline_seat_recline_normal';
    if (seat.Estado?.id == 92 && seat.clienteId == this.clientId)
      return 'check_circle';
    return 'block';
  }

  canFinailize(): boolean {
    return this.mySeats.some((seat) => seat.Estado?.id == 93);
  }

  getOpacity(seat: seatPosInterface): number {
    switch (this.modeVisualization) {
      case 0:
        return 1;
        break;
      case 1:
        return seat.Estado?.id == 94 ? 1 : 0.5;
        break;
      case 2:
        const SEAT = this.mySeats.find((s) => s.Id == seat.Id);
        return SEAT?.checked ? 1 : 0.5;
        break;
      default:
        return 1;
        break;
    }
  }
}
