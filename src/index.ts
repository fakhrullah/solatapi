import fastify from 'fastify';
import notImplementYetRoutes from './not-implement-yet-routes.js';
import timesRoute from './times-route.js';

const server = fastify();

server.register(timesRoute);
server.register(notImplementYetRoutes);

server.get('/', async (req, reply) => {
  return {
    status: 'OK',
    message: 'SolatAPI - API untuk waktu solat di Malaysia. Data waktu solat diambil dari laman web JAKIM. Dibina oleh Fajarhac Technology. Lawati https://fajarhac.com'
  }
})

server.get('/health', async (req, reply) => {
  return {
    'status': 'OK'
  };
})

server.listen(process.env.PORT || 4000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server start`);
  console.log(`Server listening at ${address}`);
});
