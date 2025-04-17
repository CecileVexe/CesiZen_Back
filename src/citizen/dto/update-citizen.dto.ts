import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCitizenDto {
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

export class UpdateCitizenCredentialsDto extends UpdateCitizenDto {
  @IsNotEmpty()
  password: string;
}
