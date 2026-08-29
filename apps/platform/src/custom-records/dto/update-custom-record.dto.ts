import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomRecordDto } from './create-custom-record.dto';

export class UpdateCustomRecordDto extends PartialType(CreateCustomRecordDto) {}
