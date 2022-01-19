import { FastifyPluginAsync } from "fastify";

interface IDay {
  Params: {
    zone: string
  },
  
}

const notImplementYetRoutes: FastifyPluginAsync = async (fastify, opts) => {

  fastify.get<IDay>('/today/:zone?', (request, reply) => {
    const { zone } = request.params;
    console.log(zone);
    if (!zone) {
      throw new Error('Zone is required.')
    }

    reply
      .code(501)
      .send({
        status: 'success',
        message: 'Not implement yet. Will implement it as soon as possible.'
      })
  });
}

export default notImplementYetRoutes;
