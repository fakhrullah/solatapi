import fastify from 'fastify';

const server = fastify();

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
