import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  createUser() {
    return {
      message:
        'I am getting called from user module that user created successfully!',
    };
  }
}
