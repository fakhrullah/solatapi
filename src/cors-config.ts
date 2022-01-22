import { FastifyCorsOptions } from "fastify-cors";

let corsConfig: FastifyCorsOptions;

const allowedOrigins: (string | RegExp)[] = [
  '*.fajarhac.com',
  'fajarhac.com',
  // /localhost/i,
]

if (/development/i.test(process.env.NODE_ENV ?? '')) {
  corsConfig = {
    origin: '*',
  }
} else {
  corsConfig = {
    origin: allowedOrigins
  }
}

export default corsConfig;
