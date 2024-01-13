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
        message: `Please use v2 API. https://${request.hostname}/v2/today/${zone}`
      })
  });

  fastify.get<IDay>('/tomorrow/:zone?', async (request) => {
    const { zone } = request.params;
    console.log(zone);
    if (!zone) {
      throw new Error('Zone is required.')
    }

    return {
      statusCode: 501,
      status: "success",
      message: `Please use v2 API. https://${request.hostname}/v2/tomorrow/${zone}`
    };
  });
}

export default notImplementYetRoutes;
