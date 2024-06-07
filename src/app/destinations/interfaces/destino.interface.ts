import { airlineDto } from '@airline/interface/airline.interface';
import { aeropuertoDto } from '@airport/interface/aeropuerto.interface';

export interface destinoCreationDto {
  aerolineaId: number;
  aeropuertoId: number;
  isDestino: boolean;
}

export interface destinoDto {
  id: number;
  aerolinea: airlineDto;
  aeropuerto: aeropuertoDto;
  isDestino: boolean;
}
