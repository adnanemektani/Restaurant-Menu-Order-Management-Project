import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios";

const socket = io("http://localhost:5000");

interface Order {
  id: number;
  table_number: number;
  status: string;
  total: string;
  created_at: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    socket.on("newOrder", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on("orderUpdated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
      );
    });
    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      console.log("orders:", res.data);
      setOrders(res.data);
    } catch (error) {
      console.error("fetchOrders error:", error);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/orders/${id}`, { status });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + parseFloat(o.total), 0)
    .toFixed(2);

  const statusConfig: any = {
    new: {
      label: "New",
      line: "bg-stone-800",
      btnColor:
        "border-stone-600 text-stone-700 hover:bg-stone-800 hover:text-white",
    },
    preparing: {
      label: "Preparing",
      line: "bg-amber-700",
      btnColor:
        "border-amber-700 text-amber-800 hover:bg-amber-700 hover:text-white",
    },
    ready: {
      label: "Ready",
      line: "bg-blue-800",
      btnColor:
        "border-blue-700 text-blue-800 hover:bg-blue-800 hover:text-white",
    },
    delivered: {
      label: "Delivered",
      line: "bg-green-800",
      btnColor:
        "border-green-700 text-green-800 hover:bg-green-800 hover:text-white",
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f5ede0" }}
    >
      {/* Navbar FIXED */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center shadow-md"
        style={{ backgroundColor: "#3b1f0f" }}
      >
        <h1
          className="text-2xl font-bold text-amber-100"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Orders Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/analytics")}
            className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all"
          >
            Analytics
          </button>
          <button onClick={() => navigate('/menu')}
  className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all">
  Menu
</button>
<button onClick={() => navigate('/tables')}
  className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all">
  Tables
</button>
          <button
            onClick={logout}
            className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content — padding top bach mayskhbch te7t navbar */}
      <div className="pt-20 pb-12 px-8 flex-1">
        {/* Stats */}
        <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: orders.length },
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "new").length,
            },
            {
              label: "In Progress",
              value: orders.filter((o) => o.status === "preparing").length,
            },
            { label: "Revenue (DH)", value: totalRevenue },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/40 border border-stone-800 rounded-2xl p-4 text-center shadow-sm"
            >
              <p className="text-stone-600 text-sm mb-1">{stat.label}</p>
              <p
                className="text-3xl font-bold text-stone-800"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["new", "preparing", "ready", "delivered"].map((status) => (
            <div
              key={status}
              className="bg-white/30 border border-stone-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="p-4 text-center">
                <h2
                  className="text-lg font-semibold text-stone-800 uppercase tracking-widest"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {statusConfig[status].label}
                </h2>
              </div>
              <div className={`h-0.5 w-full ${statusConfig[status].line}`} />
              <div className="p-3 space-y-3">
                {orders.filter((o) => o.status === status).length === 0 && (
                  <p className="text-center text-stone-400 text-sm py-4">—</p>
                )}
                {orders
                  .filter((o) => o.status === status)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-white/50 border border-stone-300 rounded-xl p-3"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-stone-800">
                          Table {order.table_number}
                        </span>
                        <span className="text-amber-800 font-semibold text-sm">
                          {order.total} DH
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs mb-3">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {["new", "preparing", "ready", "delivered"]
                          .filter((s) => s !== order.status)
                          .map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(order.id, s)}
                              className={`text-xs px-2 py-1 rounded-lg border transition-all ${statusConfig[s].btnColor}`}
                            >
                              → {s}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer FIXED */}
      <footer
        className="fixed bottom-0 left-0 right-0 py-2 text-center text-stone-400 text-xs border-t border-stone-300"
        style={{ backgroundColor: "#f5ede0" }}
      >
        Crafted with care for your restaurant —{" "}
        <span className="text-stone-600 font-medium">Adnane Mektani</span>
      </footer>
    </div>
  );
}
