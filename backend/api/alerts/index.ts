import { app } from '../../src/index';

export default async function(req: any, res: any) {
  await new Promise((resolve, reject) => {
    app(req, res, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}
