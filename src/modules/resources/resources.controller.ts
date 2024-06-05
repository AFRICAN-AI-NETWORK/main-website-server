import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {}
