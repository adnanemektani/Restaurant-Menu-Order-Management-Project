import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

export default function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rev, items, hours] = await Promise.all([
        api.get("/analytics/revenue"),
        api.get("/analytics/top-items"),
        api.get("/analytics/peak-hours"),
      ]);
      setRevenue(rev.data.reverse());
      setTopItems(items.data);
      setPeakHours(hours.data);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f5ede0" }}
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center shadow-md"
        style={{ backgroundColor: "#3b1f0f" }}
      >
        <h1
          className="text-2xl font-bold text-amber-100"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Analytics
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={logout}
            className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-8 flex-1">
        {/* Revenue Chart */}
        <div className="bg-white/40 border border-stone-800 rounded-2xl p-6 mb-6">
          <h2
            className="text-xl font-bold text-stone-800 mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Revenue (Last 30 days)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6cfc7" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("fr-MA", {
                    day: "2-digit",
                    month: "short",
                  })
                }
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`${v} DH`, "Revenue"]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#92400e"
                strokeWidth={2}
                dot={{ fill: "#92400e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Items */}
          <div className="bg-white/40 border border-stone-800 rounded-2xl p-6">
            <h2
              className="text-xl font-bold text-stone-800 mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Top Items
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d6cfc7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [v, "Orders"]} />
                <Bar
                  dataKey="total_ordered"
                  fill="#92400e"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours */}
          <div className="bg-white/40 border border-stone-800 rounded-2xl p-6">
            <h2
              className="text-xl font-bold text-stone-800 mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Peak Hours
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d6cfc7" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}h`}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [v, "Orders"]} />
                <Bar
                  dataKey="total_orders"
                  fill="#78350f"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer */}
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
