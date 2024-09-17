export interface IOrderRepository {
  createOrder(data: any): Promise<object | null>;
  getOrdersAnalytics(instructorId: string): Promise<object[] | null>;
}
