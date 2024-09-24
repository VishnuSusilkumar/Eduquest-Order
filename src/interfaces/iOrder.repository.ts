export interface IOrderRepository {
  createOrder(data: any): Promise<object | null>;
  getOrdersAnalytics(instructorId: string): Promise<object[] | null>;
  getRevenueAnalytics(instructorId?: string): Promise<Object[]>;
  getTotalInstructorRevenueByCourse(courseId: string): Promise<number | null>;
}
