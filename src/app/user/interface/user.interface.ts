export interface UserDto {
  userName: string;
  email: string;
  isActive?: boolean;
  roles?: string[];
}
export interface UserCreateDto extends UserDto {
  password: string;
}

export interface userQueryFilter {
  UserName?: string;
  Email?: string;
}
export interface userUpdateDto {
  roles: string[];
  status: boolean;
}
