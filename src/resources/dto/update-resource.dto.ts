import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  // For updating access list in RESTRICTED mode
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessUserIds?: string[];
}
