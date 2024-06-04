import { ApiProperty } from '@nestjs/swagger';

class ResponseEntity {
  @ApiProperty({
    type: 'string',
  })
  message: string;
  statusCode: number;
}

class ErrorResponseEntity extends ResponseEntity {
  error?: string;
}

export class NotFoundResponseEntity extends ErrorResponseEntity {
  @ApiProperty({
    type: 'number',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Not Found',
  })
  error: string;
}

export class UnauthorizedErrorResponseEntity extends ErrorResponseEntity {
  @ApiProperty({
    type: 'number',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unauthorized',
  })
  error: string;
}

export class BadRequestErrorResponseEntity extends ErrorResponseEntity {
  @ApiProperty({
    type: 'number',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request',
  })
  error: string;
}

export class InternalServerErrorResponseEntity extends ErrorResponseEntity {
  @ApiProperty({
    type: 'number',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Internal Server Error',
  })
  error: string;
}
