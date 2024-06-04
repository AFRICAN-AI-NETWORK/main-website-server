import * as bcrypt from 'bcrypt';

export const hash = async (payload: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(payload, saltRounds);
};

export const compare = async (payload: string, hash: string) =>
  bcrypt.compare(payload, hash);
