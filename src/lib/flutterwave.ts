import * as Flutterwave from 'flutterwave-node-v3';

export const flutterwave = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY,
);
