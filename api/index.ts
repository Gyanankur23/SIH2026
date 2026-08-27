import backendApp from '../backend/src/index';

// Vercel serverless function entry point
export default async function(req: any, res: any) {
  await new Promise((resolve, reject) => {
    backendApp(req, res, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}
