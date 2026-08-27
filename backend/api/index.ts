import { app } from '../src/index';

// Vercel serverless function entry point
export default async function(req: any, res: any) {
  // Handle the request with the Express app
  await new Promise((resolve, reject) => {
    app(req, res, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}
