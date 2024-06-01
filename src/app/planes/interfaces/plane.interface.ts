import { catalogueInterface } from '@utils/commons.interface';

export interface seatPosInterface {
  position: posInterface;
  clase: catalogueInterface;
  Id?: number;
  Estado?: catalogueInterface;
}

export interface posInterface {
  x: number;
  y: number;
}
