import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import notImplementYetRoutes from './not-implement-yet-routes.js';
import timesRoute from './times-route.js';
import { zonesRoute } from './zones-route.js';
import corsConfig from './cors-config.js';

const server = fastify();

server.register(fastifyCors, corsConfig);
server.register(timesRoute);
server.register(zonesRoute);
server.register(notImplementYetRoutes);

console.log('NODE_ENV" ', process.env.NODE_ENV);

server.get('/', async (req, reply) => {
  return {
    status: 'OK',
    message: 'SolatAPI - API untuk waktu solat di Malaysia. Data waktu solat diambil dari laman web JAKIM. Dibina oleh Fajarhac Technology. Lawati https://solatapi.fajarhac.com/api'
  }
})

server.get('/health', async (req, reply) => {
  return {
    'status': 'OK'
  };
})

server.listen(process.env.PORT || 4000, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server start`);
  console.log(`Server listening at ${address}`);
});
