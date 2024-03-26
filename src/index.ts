import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import notImplementYetRoutes from './not-implement-yet-routes.js';
import timesRoute from './times-route.js';
import { zonesRoute } from './zones-route.js';
import corsConfig from './cors-config.js';
import timesRouteV2 from './times-route-v2.js';
import { zonesRouteV2 } from './zones-route-v2.js';
import todayTomorrowRoutesV2 from './v2-today-tomorrow-route.js';

const server = fastify();

server.register(fastifyCors, corsConfig);
server.register(timesRoute);
server.register(zonesRoute);
server.register(notImplementYetRoutes);

// v2
server.register(timesRouteV2);
server.register(todayTomorrowRoutesV2);
server.register(zonesRouteV2);

console.log('NODE_ENV" ', process.env.NODE_ENV);

server.get('/', async (req, reply) => {
  return {
    status: 'OK',
    message: 'SolatAPI - API untuk waktu solat di Malaysia. Data waktu solat diambil dari laman web JAKIM. Dibina oleh Fajarhac Technology. Lawati https://solatapi.fajarhac.com/api untuk cara guna API'
  }
});

server.get('/info', async (req, reply) => {
  return {
    status: 'OK',
    message: 'SolatAPI - API untuk waktu solat di Malaysia. Data waktu solat diambil dari laman web JAKIM. Dibina oleh Fajarhac Technology. Lawati https://solatapi.fajarhac.com/api untuk cara guna API'
  }
});

server.get('/health', async (req, reply) => {
  return {
    'status': 'OK'
  };
})

const getPort = (): number => parseInt(process.env.PORT!) || 4000;

server.listen({ port: getPort() }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server start`);
  console.log(`Server listening at ${address}`);
});
