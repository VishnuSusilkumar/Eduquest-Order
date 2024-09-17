import { IOrderRepository } from "../interfaces/iOrder.repository";
import OrderModel from "../model/schemas/order.schema";

export class OrderRepository implements IOrderRepository {
  async createOrder(data: any): Promise<object | null> {
    try {
      const course = await OrderModel.create(data);
      return { success: true };
    } catch (e: any) {
      throw new Error("DB Error");
    }
  }

  async getOrdersAnalytics(instructorId: any): Promise<Object[] | null> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const matchStage: any = {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      };
      if (instructorId !== "admin") {
        matchStage.$match.instructorId = instructorId;
      }

      const response = await OrderModel.aggregate([
        matchStage,
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]);

      return response || [];
    } catch (e: any) {
      throw new Error("DB Error");
    }
  }
}
