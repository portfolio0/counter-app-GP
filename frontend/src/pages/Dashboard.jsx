import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({});
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAll = async () => {
    const catRes = await axios.get(
      "https://counter-app-gp.onrender.com/api/categories",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const sumRes = await axios.get(
      "https://counter-app-gp.onrender.com/api/counter/summary",
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const sumObj = {};
    sumRes.data.forEach((item) => {
      sumObj[item._id] = item.total;
    });

    setCategories(catRes.data);
    setSummary(sumObj);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addCategory = async () => {
    if (!name) return;
    await axios.post(
      "https://counter-app-gp.onrender.com/api/categories",
      { name },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setName("");
    fetchAll();
  };

  const action = async (id, type) => {
    await axios.post(
      "https://counter-app-gp.onrender.com/api/counter/action",
      { categoryId: id, action: type },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-4 flex justify-between items-center">
        <span
          className="text-sm cursor-pointer"
          onClick={() => navigate("/history")}
        >
          History
        </span>
        <h1 className="text-lg font-semibold">Count List</h1>
        <span className="text-2xl font-bold">+</span>
      </div>

      {/* Add Category Input */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex gap-2">
          <input
            placeholder="New Counter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
          <button
            onClick={addCategory}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Counter List */}
      <div className="bg-white">
        {categories.map((c) => (
          <div
            key={c._id}
            className="flex justify-between items-center px-4 py-6 border-b"
          >
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-light text-purple-600">
                {summary[c._id] || 0}
              </span>
              <span className="text-base text-gray-700">{c.name}</span>
            </div>

            {/* Right Side Buttons */}
            <div className="flex bg-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => action(c._id, "decrement")}
                className="px-5 py-2 text-purple-600 text-xl font-medium border-r"
              >
                −
              </button>
              <button
                onClick={() => action(c._id, "increment")}
                className="px-5 py-2 text-purple-600 text-xl font-medium"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
