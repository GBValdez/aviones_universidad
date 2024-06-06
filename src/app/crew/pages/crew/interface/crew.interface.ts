import { airlineDto } from '@airline/interface/airline.interface';
import { personalDto } from '@crew/pages/personal/interface/personal.interface';

interface crewDtoBase {
  codigo: string;
}

export interface crewDtoCreation extends crewDtoBase {
  aerolineaId: number;
}

export interface crewDto extends crewDtoBase {
  id: number;
  aerolinea: airlineDto;
  empleados: personalDto[];
}
