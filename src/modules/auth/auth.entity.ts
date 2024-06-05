import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/users.entity';

export class AuthTokensEntity {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjI0YzI0NzY2YzJjZDg3NjQwYjY5YyIsImlhdCI6MTY1NjUyMjQzMiwiZXhwIjoxNjU2NTIyNDMyfQ.3m8ZUJjyCfKwXVhZL9z2kXgZ2p6vXZ6b',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token for obtaining new access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjI0YzI0NzY2YzJjZDg3NjQwYjY5YyIsImlhdCI6MTY1NjUyMjQzMiwiZXhwIjoxNjU2NTIyNDMyfQ.3m8ZUJjyCfKwXVhZL9z2kXgZ2p6vXZ6b',
  })
  refreshToken: string;
}

export class AuthResponseEntity extends AuthTokensEntity {
  @ApiProperty({ description: "User's data" })
  user: UserEntity;
}
