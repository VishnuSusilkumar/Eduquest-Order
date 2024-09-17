import { OrderController } from "../controller/order.controller";
import { OrderRepository } from "../repository/order.repository";
import { OrderService } from "../services/order.service";
import rabbitClient from "./client";

const orderRepository = new OrderRepository();
const service = new OrderService(orderRepository);
const controller = new OrderController(service);

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log("The operation is", operation, data);

    switch (operation) {
      case "stripe-publishkey":
        response = await controller.sendPublishKey.bind(controller)();
        break;

      case "payment-intent":
        response = await controller.newPayment.bind(controller)(data);
        break;

      case "create-order":
        response = await controller.createOrder.bind(controller)(data);
        break;

      case "orders-analytics":
        response = await controller.getOrdersAnalytics.bind(controller)(data);
        break;

      default:
        response = "Request-key notfound";
        break;
    }

    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
