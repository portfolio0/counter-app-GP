import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function AdminPanel() {
  const [logs, setLogs] = useState([]);
  const [userFilter, setUserFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://counter-app-gp.onrender.com/api/counter/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data));
  }, []);

  const users = [...new Set(logs.map((l) => l.userId?.name))];
  const categories = [...new Set(logs.map((l) => l.categoryId?.name))];

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchUser = userFilter === "all" || log.userId?.name === userFilter;

      const matchCategory =
        categoryFilter === "all" || log.categoryId?.name === categoryFilter;

      const today = new Date().toDateString();
      const logDate = new Date(log.createdAt).toDateString();

      const matchDate =
        dateFilter === "all" || (dateFilter === "today" && today === logDate);

      return matchUser && matchCategory && matchDate;
    });
  }, [logs, userFilter, categoryFilter, dateFilter]);

  const total = filtered.reduce(
    (acc, log) => acc + (log.action === "increment" ? 1 : -1),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-purple-600 text-white p-4 rounded-xl mb-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm">Total Net Count: {total}</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-4 space-y-3">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="all">All Users</option>
            {users.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
          </select>
        </div>

        {/* Logs */}
        <div className="space-y-3">
          {filtered.map((log) => (
            <div
              key={log._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <div>
                <div className="font-medium">{log.userId?.name}</div>
                <div className="text-sm text-gray-500">
                  {log.categoryId?.name}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  log.action === "increment"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {log.action === "increment" ? "+1" : "-1"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
