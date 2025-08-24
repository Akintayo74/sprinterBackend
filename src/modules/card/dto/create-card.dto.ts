import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TagDto {
  @IsString()
  name: string;

  @IsString()
  color: string;
}

class ChecklistItemDto {
  @IsString()
  text: string;

  @IsOptional()
  completed?: boolean;
}

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  checklist: ChecklistItemDto[];
}
