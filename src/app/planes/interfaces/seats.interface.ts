import { catalogueInterface } from '@utils/commons.interface';
import { avionDto } from './avion.interface';
import { vueloClaseDto, vueloDto } from '@buyTicket/interfaces/vuelo.interface';

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
  estado?: catalogueInterface;
}

export interface seatWithPlaneDto {
  avion: avionDto;
  asientoDtos: seatDto[];
  classList: vueloClaseDto[];
}

export interface boletoDto {
  cantidadMaletasAdquiridas: number;
  cantidadMaletasPresentadas: number;
  asientoId: number;
  clienteId?: number;
  asiento?: seatDto;
  // cliente: clientedto;
  estadoBoleto: catalogueInterface;
  vuelo?: vueloDto;
}
