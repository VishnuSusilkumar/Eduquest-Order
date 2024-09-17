import "dotenv/config";

export default {
  rabbitMQ: {
    url: String(process.env.RabbitMQ_Link),
    queues: {
      orderQueue: "order_queue",
    },
  },
};
