import { IOrderService } from "../interfaces/iOrder.service";

export class OrderController {
  constructor(private service: IOrderService) {}

  createOrder = async (data: any) => {
    try {
      const response = await this.service.createOrder(data);
      return response;
    } catch (e: any) {
      console.error("Error in createOrder:", e.message, e.stack);
      throw new Error(`Error in createOrder: ${e.message}`);
    }
  };

  sendPublishKey = () => {
    try {
      return { publishKey: process.env.STRIPE_PUBLISH_KEY };
    } catch (e: any) {
      console.log(e);
    }
  };

  newPayment = (data: string) => {
    try {
      return this.service.newPayment(data);
    } catch (e: any) {
      console.log(e);
    }
  };

  getOrdersAnalytics = async (instructorId: string) => {
    try {
      console.log("Order InstuctorId: ", instructorId);

      return this.service.getOrdersAnalytics(instructorId);
    } catch (e: any) {
      console.log(e);
    }
  };

  getRevenueAnalytics = async (instructorId?: string) => {
    try {
      
      return await this.service.getRevenueAnalytics(instructorId);
    } catch (e: any) {
      console.log(e);
    }
  };

  getTotalInstructorRevenueByCourse = async (courseId: string) => {
    try {
      const totalRevenue = await this.service.getTotalInstructorRevenueByCourse(
        courseId
      );
      console.log(totalRevenue);
      return { courseId, totalInstructorRevenue: totalRevenue };
    } catch (e: any) {
      console.log(e);
    }
  };
}
