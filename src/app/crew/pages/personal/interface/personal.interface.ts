import { countryDto } from '@country/interfaces/pais.interface';
import { crewDto } from '@crew/pages/crew/interface/crew.interface';
import { UserDto } from '@user/interface/user.interface';
import { catalogueInterface } from '@utils/commons.interface';

interface personalDtoBase {
  nombre: string;
  fechaNacimiento: Date;
  correo: string;
  direccion: string;
  telefono: string;
}

export interface personalDtoCreation extends personalDtoBase {
  paisId: number;
  puestoId: number;
  tripulacionId: number;
  aerolineaId: number;
  userId: string;
}

export interface personalDto extends personalDtoBase {
  id: number;
  pais: countryDto;
  puesto: catalogueInterface;
  tripulacion: crewDto;
  user: UserDto;
}
