import { FastifyCorsOptions } from "@fastify/cors";

let corsConfig: FastifyCorsOptions;

// const allowedOrigins: (string | RegExp)[] = [
//   /\.fajarhac\.com$/i,
//   'fajarhac.com',
//   // /localhost/i,
// ]

// if (/development/i.test(process.env.NODE_ENV ?? '')) {
//   corsConfig = {
//     origin: '*',
//   }
// } else {
//   corsConfig = {
//     origin: allowedOrigins
//   }
// }

// This is just read API so allow all by default

corsConfig = {
  origin: '*'
}

export default corsConfig;
