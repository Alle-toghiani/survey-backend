import { IsString } from '@nestjs/class-validator';

export class CreateModDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  parentId: string;
}
