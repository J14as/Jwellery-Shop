import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-charcoal text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">✦ Admin Dashboard</h1>
          <div className="text-sm">
            Welcome, {session.user.name}
          </div>
        </div>
      </header>

      {/* Admin Sidebar Navigation */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
        <nav className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
            <ul className="space-y-2">
              <li><a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-cream">Dashboard</a></li>
              <li><a href="/admin/products" className="block px-4 py-2 rounded hover:bg-cream">Products</a></li>
              <li><a href="/admin/orders" className="block px-4 py-2 rounded hover:bg-cream">Orders</a></li>
              <li><a href="/admin/customers" className="block px-4 py-2 rounded hover:bg-cream">Customers</a></li>
              <li><a href="/admin/inventory" className="block px-4 py-2 rounded hover:bg-cream">Inventory</a></li>
            </ul>
          </div>
        </nav>

        {/* Content */}
        <div className="md:col-span-4">
          {children}
        </div>
      </div>
    </div>
  );
}
