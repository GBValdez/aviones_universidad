import { MatTooltip } from '@angular/material/tooltip';
import { vueloClaseDto } from '@buyTicket/interfaces/vuelo.interface';
import { catalogueInterface } from '@utils/commons.interface';

export interface seatPosInterface {
  position: posInterface;
  clase: catalogueInterface;
  Id?: number;
  Estado?: catalogueInterface;
  clienteId?: number;
  Codigo?: string;
  tooltip?: MatTooltip;
}

export interface mySeatPosInterface extends seatPosInterface {
  checked?: boolean;
}
export interface posInterface {
  x: number;
  y: number;
}

export interface modalFinishSeatInterface {
  mySeats: mySeatPosInterface[];
  clases: vueloClaseDto[];
  idVuelo: number;
}

export interface paySeatInterface {
  vueloId: number;
  seats: number[];
}

export interface configSeatPlane {
  showTooltipText?: (seat: seatPosInterface) => string;
  blockSeat?: (seat: seatPosInterface) => boolean;
  opacitySeat?: (seat: seatPosInterface) => number;
  getIcon: (seat: seatPosInterface) => string | string;
  sizeWidth: number;
  img: string;
}
