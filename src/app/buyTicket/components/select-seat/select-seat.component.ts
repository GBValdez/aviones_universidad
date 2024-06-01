import { NgClass, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { selectVueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';
import {
  posInterface,
  seatPosInterface,
} from '@plane/interfaces/plane.interface';
import { PlaneService } from '@plane/services/plane.service';
import { SeatsService } from '@plane/services/seats.service';

@Component({
  selector: 'app-select-seat',
  standalone: true,
  imports: [NgClass, MatIconModule, MatButtonModule, NgStyle],
  templateUrl: './select-seat.component.html',
  styleUrl: './select-seat.component.scss',
})
export class SelectSeatComponent implements AfterViewInit, OnInit {
  constructor(
    private routerAct: ActivatedRoute,
    private planeService: PlaneService,
    private http: HttpClient,
    private seatSvc: SeatsService,
    private vueloSvc: VueloService
  ) {}
  ngOnInit(): void {
    this.vueloSvc.getSeat().subscribe((res) => {
      if (res) {
        // console.log(res);
        this.seats = res.asientoDtos.map((seat) => {
          const [x, y] = seat.posicion.split('|').map(Number);
          return {
            position: { x, y },
            clase: seat.clase,
            Id: seat.id,
            Estado: seat.estado,
          };
        });
      }
      console.log('pepe', res);
    });
  }

  sendSeat(seat: seatPosInterface) {
    const SEAT_DTO: selectVueloDto = {
      VueloId: this.idFly,
      AsientoId: seat.Id!,
    };
    this.vueloSvc.sendSeat(SEAT_DTO);
  }

  ngAfterViewInit(): void {
    this.idFly = this.routerAct.snapshot.params['id'];
    this.uploadBase();
    this.seatSvc.getByFly(this.idFly).subscribe((res) => {
      this.seats = res.asientoDtos.map((seat) => {
        const [x, y] = seat.posicion.split('|').map(Number);
        console.log(seat);
        return {
          position: { x, y },
          clase: seat.clase,
          Id: seat.id,
          Estado: seat.estado,
        };
      });
      console.log('a', this.seats);
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

  wScreen: number = window.innerWidth;
  hScreen: number = window.innerHeight;
  zoom: WritableSignal<number> = signal(1);
  translatePos: posInterface = { x: 0, y: 0 };
  seats: seatPosInterface[] = [];
  sizePixelSize: number = 10;
  sizeWidth: number = 0;
  closeSidenav: boolean = false;
  idFly: number = 0;
  timeOutSize: any;
  posOrigin?: posInterface;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  img: any = null;
  keepClicking: boolean = false;
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
}
