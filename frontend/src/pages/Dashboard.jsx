import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({});
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
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

  // 🔥 YOUR EXISTING ACTION LOGIC (UNCHANGED)
  const action = async (id, type) => {
    const currentValue = summary[id] || 0;

    if (type === "decrement" && currentValue <= 0) {
      return;
    }

    setSummary((prev) => ({
      ...prev,
      [id]: currentValue + (type === "increment" ? 1 : -1),
    }));

    try {
      await axios.post(
        "https://counter-app-gp.onrender.com/api/counter/action",
        { categoryId: id, action: type },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      setSummary((prev) => ({
        ...prev,
        [id]: currentValue,
      }));
    }
  };

  // 🔥 NEW: Delete Category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this counter?")) return;

    await axios.delete(
      `https://counter-app-gp.onrender.com/api/categories/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    fetchAll();
  };

  // 🔥 NEW: Update Category
  const updateCategory = async (id) => {
    if (!editName.trim()) return;

    await axios.put(
      `https://counter-app-gp.onrender.com/api/categories/${id}`,
      { name: editName },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setEditingId(null);
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

      {/* Add Category */}
      {role !== "admin" && (
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
      )}

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

              {editingId === c._id ? (
                <div className="flex gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  />
                  <button
                    onClick={() => updateCategory(c._id)}
                    className="text-green-600 text-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span className="text-base text-gray-700">{c.name}</span>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Edit/Delete only for USER */}
              {role !== "admin" && editingId !== c._id && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setEditName(c.name);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}

              {/* Counter Buttons (Unchanged) */}
              <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                <button
                  disabled={(summary[c._id] || 0) <= 0}
                  onClick={() => action(c._id, "decrement")}
                  className={`px-5 py-2 text-purple-600 text-xl font-medium border-r ${
                    (summary[c._id] || 0) <= 0
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }`}
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
          </div>
        ))}
      </div>
    </div>
  );
}
