import { vueloClaseDto } from '@buyTicket/interfaces/vuelo.interface';
import { catalogueInterface } from '@utils/commons.interface';

export interface seatPosInterface {
  position: posInterface;
  clase: catalogueInterface;
  Id?: number;
  Estado?: catalogueInterface;
  clienteId?: number;
  Codigo?: string;
}

export interface posInterface {
  x: number;
  y: number;
}
