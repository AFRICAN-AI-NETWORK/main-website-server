import { User } from '@prisma/client';
import 'socket.io';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'flutterwave-node-v3';
