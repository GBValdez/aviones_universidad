import { countryDto } from '@country/interfaces/pais.interface';

export interface UserDto {
  userName: string;
  email: string;
  isActive?: boolean;
  roles?: string[];
}
export interface UserCreateDto {
  password: string;
  userName: string;
  noPasaporte: string;
  nombre: string;
  fechaNacimiento: Date;
  correo: string;
  telefono: string;
  telefonoEmergencia: string;
  direccion: string;
  paisId: number;
  codigoTelefono: number;
  codigoTelefonoEmergencia: number;
}

export interface userQueryFilter {
  UserName?: string;
  Email?: string;
}
export interface userUpdateDto {
  roles: string[];
  status: boolean;
}

export interface clientedto {
  noPasaporte: string;
  nombre: string;
  fechaNacimiento: Date;
  correo: string;
  telefono: string;
  telefonoEmergencia: string;
  direccion: string;
  codigoTelefonoEmergenciaNavigation: countryDto;
  codigoTelefonoNavigation: countryDto;
  pais: countryDto;
}
