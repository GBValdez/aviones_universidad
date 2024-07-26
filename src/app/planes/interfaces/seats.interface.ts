import { catalogueInterface, pagDto } from '@utils/commons.interface';
import { avionDto } from './avion.interface';
import { vueloClaseDto, vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { clientedto } from '@user/interface/user.interface';

export interface seatBaseDto {
  codigo: string;
  posicion: string;
}

export interface seatCreationDto extends seatBaseDto {
  ClaseId: number;
  AvionId?: number;
}

export interface seatPlaneCreation {
  asientos: seatCreationDto[];
  sizeSeat: number;
}

export interface seatDto extends seatBaseDto {
  id: number;
  clase: catalogueInterface;
  codigo: string;
}

export interface seatWithPlaneDto {
  avion: avionDto;
  asientoDtos: seatDto[];
  classList: vueloClaseDto[];
  boletos: boletoDto[];
}

export interface boletoDto {
  cantidadMaletasPresentadas: number;
  asientoId: number;
  clienteId?: number;
  asiento?: seatDto;
  // cliente: clientedto;
  estadoBoleto: catalogueInterface;
  vuelo?: vueloDto;
  codigo: string;
  cliente?: clientedto;
  claseId?: number;
}

export interface ticketCompleteDto {
  boletos: boletoDto[];
  vuelo: vueloDto;
  cliente: clientedto;
}

export interface ticketBodyDto {
  codigo: string;
  cantidadDeMaletas: number;
}
export interface flyWithTicket {
  vuelo: vueloDto;
  boletos: pagDto<boletoDto>;
}

export interface ticketDto {
  ticket: string;
}

export interface ticketFinDto {
  ticket: string;
  ticketFinish: ticketBodyDto[];
}
