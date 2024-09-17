import mongoose, { Model, Schema } from "mongoose";
import "dotenv/config";

export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
    },
  },
  { timestamps: true }
);

const OrderModel: Model<any> = mongoose.model("Order", orderSchema);
export default OrderModel;
