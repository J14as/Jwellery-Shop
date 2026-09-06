import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PricingService } from "@/lib/pricing/PricingService";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/sign-in");
  }

  // Fetch metrics
  const [totalOrders, totalCustomers, totalSales, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { fulfillmentStatus: "PENDING" } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold text-charcoal mb-8">Admin Dashboard</h1>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Total Sales</div>
          <div className="text-3xl font-bold text-charcoal">
            {PricingService.formatPrice(totalSales._sum.totalAmount || 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Total Orders</div>
          <div className="text-3xl font-bold text-charcoal">{totalOrders}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Total Customers</div>
          <div className="text-3xl font-bold text-charcoal">{totalCustomers}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Pending Orders</div>
          <div className="text-3xl font-bold text-charcoal">{pendingOrders}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-cream">
                  <td className="py-3 px-4 font-semibold">{order.orderNumber}</td>
                  <td className="py-3 px-4">{order.user.name}</td>
                  <td className="py-3 px-4">{PricingService.formatPrice(order.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      order.fulfillmentStatus === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Links */}
      <div className="grid md:grid-cols-4 gap-6 mt-8">
        <a href="/admin/products" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer">
          <div className="text-2xl mb-2">📦</div>
          <h3 className="font-semibold text-charcoal">Manage Products</h3>
          <p className="text-sm text-gray-600">Add, edit & delete products</p>
        </a>
        <a href="/admin/orders" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-charcoal">Manage Orders</h3>
          <p className="text-sm text-gray-600">Process & track orders</p>
        </a>
        <a href="/admin/customers" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold text-charcoal">Customers</h3>
          <p className="text-sm text-gray-600">View customer data</p>
        </a>
        <a href="/admin/inventory" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-charcoal">Inventory</h3>
          <p className="text-sm text-gray-600">Stock management</p>
        </a>
      </div>
    </div>
  );
}
