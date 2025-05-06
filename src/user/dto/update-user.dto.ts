import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  clerkId: string;

  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  surname: string;

  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  roleId: string;
}

export class UpdateUserCredentialsDto extends UpdateUserDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  password: string;
}
