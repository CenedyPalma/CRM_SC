import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomObjectDto } from './create-custom-object.dto';

export class UpdateCustomObjectDto extends PartialType(CreateCustomObjectDto) {}
