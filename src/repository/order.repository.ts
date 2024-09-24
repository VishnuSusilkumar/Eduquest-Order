import { IOrderRepository } from "../interfaces/iOrder.repository";
import { RevenuePerOrder } from "../interfaces/iRevenuePerOrder";
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

  async getRevenueAnalytics(instructorId?: string): Promise<Object[]> {
    try {
      const matchStage: any = {};

      if (instructorId) {
        matchStage.instructorId = instructorId;
      }

      const pipeline: any[] = [
        { $match: matchStage },
        {
          $group: {
            _id: "$courseId",
            totalInstructorRevenue: { $sum: "$instructorRevenue" },
            totalAdminRevenue: { $sum: "$adminRevenue" },
          },
        },
        {
          $project: {
            courseId: "$_id",
            totalInstructorRevenue: 1,
            totalAdminRevenue: 1,
            _id: 0,
          },
        },
      ];
      const response = await OrderModel.aggregate(pipeline);
      return response || [];
    } catch (e: any) {
      throw new Error("DB Error in fetching revenue analytics");
    }
  }

  async getTotalInstructorRevenueByCourse(
    courseId: string
  ): Promise<number | null> {
    try {
      const result = await OrderModel.aggregate([
        { $match: { courseId: courseId } },
        {
          $group: {
            _id: null,
            totalInstructorRevenue: { $sum: "$instructorRevenue" },
          },
        },
        {
          $project: {
            _id: 0,
            totalInstructorRevenue: 1,
          },
        },
      ]);
      return result.length > 0 ? result[0].totalInstructorRevenue : 0;
    } catch (e: any) {
      console.error(
        "DB Error in fetching total instructor revenue:",
        e.message
      );
      throw new Error("DB Error in fetching total instructor revenue");
    }
  }
}
