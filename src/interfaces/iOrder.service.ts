export interface IOrderService {
  newPayment(data: string): unknown;
  createOrder(data: any): any;
  getOrdersAnalytics(instructorId: string): Promise<object[] | null>;
}
