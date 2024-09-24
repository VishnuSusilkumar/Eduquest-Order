import { IOrderService } from "../interfaces/iOrder.service";
import "dotenv/config";
import { IOrderRepository } from "../interfaces/iOrder.repository";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export class OrderService implements IOrderService {
  constructor(private repository: IOrderRepository) {}

  async newPayment(data: string): Promise<Object> {
    try {
      const customer = await stripe.customers.create({
        name: "Jenny Rosen",
        email: "jennyrosen@example.com",
        address: {
          city: "palkkad",
          country: "US",
          state: "kerala",
          postal_code: "679336",
          line1: "123 nabeel ndjdnjd",
        },
      });
      const myPayment = await stripe.paymentIntents.create({
        amount: parseInt(data),
        currency: "inr",
        metadata: {
          company: "Eduquest",
        },
        description: "Course purchase",
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
        shipping: {
          name: "Jenny Rosen",
          address: {
            city: "palakkad",
            country: "US",
            state: "kerala",
            postal_code: "679336",
            line1: "123 nabeel ndjdnjd",
          },
        },
      });
      return { clientSecret: myPayment.client_secret };
    } catch (e: any) {
      throw new Error("Not Found");
    }
  }

  async createOrder(data: any) {
    try {
      const { amount } = data.payment_info;
      const totalAmount = Number(amount) / 100;

      if (isNaN(totalAmount)) {
        throw new Error("Invalid totalAmount provided");
      }

      const instructorRevenue = totalAmount * 0.9;
      const adminRevenue = totalAmount * 0.1;

      if (isNaN(instructorRevenue) || isNaN(adminRevenue)) {
        throw new Error("Calculated revenue values are invalid");
      }

      const orderData = {
        ...data,
        instructorRevenue,
        adminRevenue,
      };

      return await this.repository.createOrder(orderData);
    } catch (e: any) {
      console.error("Error in createOrder service:", e.message, e.stack);
      throw new Error(`Error in createOrder service: ${e.message}`);
    }
  }

  async getOrdersAnalytics(instructorId: string): Promise<Object[] | null> {
    const months: { month: string; value: string }[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString("default", { month: "long" }),
        value: date.toISOString().slice(0, 7),
      });
    }

    const response = await this.repository.getOrdersAnalytics(instructorId);
    const aggregatedData: Record<string, number> = {};
    if (response) {
      response.forEach(({ _id, count }: any) => {
        aggregatedData[_id] = count;
      });
    } else {
      return null;
    }

    const output: Object[] = months.map(({ month, value }) => ({
      month,
      count: aggregatedData[value] || 0,
    }));

    return output;
  }

  async getRevenueAnalytics(instructorId?: string): Promise<Object[]> {
    try {
      return this.repository.getRevenueAnalytics(instructorId);
    } catch (e: any) {
      throw new Error("Service Error in fetching revenue analytics");
    }
  }

  async getTotalInstructorRevenueByCourse(courseId: string): Promise<any> {
    try {
      const totalRevenue =
        await this.repository.getTotalInstructorRevenueByCourse(courseId);
      return totalRevenue;
    } catch (e: any) {
      console.log(
        "Service Error in fetching total instructor revenue:",
        e.message
      );
    }
  }
}
