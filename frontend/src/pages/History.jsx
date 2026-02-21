import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/counter/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data))
      .catch(() => alert("Failed to load history"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">History</h2>
          <Link to="/dashboard" className="text-blue-600 font-medium">
            ← Back
          </Link>
        </div>
        <h4>new history comes at top</h4>
        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {logs.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No records found
            </div>
          )}

          {logs.map((log) => (
            <div key={log._id} className="bg-white rounded-2xl shadow-md p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">
                  {log.categoryId?.name}
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    log.action === "increment"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {log.action === "increment" ? "+1" : "-1"}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                User: {log.userId?.name}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md p-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2 font-semibold text-gray-600">User</th>
                <th className="py-3 px-2 font-semibold text-gray-600">
                  Category
                </th>
                <th className="py-3 px-2 font-semibold text-gray-600">
                  Action
                </th>
                <th className="py-3 px-2 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{log.userId?.name}</td>
                  <td className="py-3 px-2">{log.categoryId?.name}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        log.action === "increment"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {log.action === "increment" ? "+1" : "-1"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
