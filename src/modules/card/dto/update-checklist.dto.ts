import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateChecklistDto {
  @IsNumber()
  index: number;   // position of the checklist item in the array

  @IsString()
  @IsNotEmpty()
  text: string;    // updated text

  @IsBoolean()
  completed: boolean; // mark true/false
}
