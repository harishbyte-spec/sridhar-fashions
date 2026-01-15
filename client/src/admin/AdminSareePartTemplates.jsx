import React, { useEffect, useState } from "react";
import "./adminTemplates.css";
import toast from "react-hot-toast";
import API_URL from "../config";

const API = API_URL;

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
};

export default function AdminSareePartTemplates({ partType }) {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const load = async () => {
    try {
        const res = await authFetch(
        `${API}/saree-parts?type=${partType}`
        );
        setList(res.templates || res.items || []);
    } catch(err) {
        console.error(err);
        // toast.error("Failed to load templates");
    }
  };

  useEffect(() => {
    load();
  }, [partType]);

  const create = async () => {
    if (!title || !content) return toast.error("Fill all fields");

    try {
        await authFetch(`${API}/saree-parts`, {
        method: "POST",
        body: JSON.stringify({
            partType,
            title,
            content,
            isLocked,
        }),
        });

        setTitle("");
        setContent("");
        setIsLocked(false);
        load();
        toast.success("Template created");
    } catch (err) {
        toast.error(err.message || "Create failed");
    }
  };

  const remove = async (id, locked) => {
    if (locked) return toast.error("Locked template");
    if (!window.confirm("Delete template?")) return;

    try {
        await authFetch(`${API}/saree-parts/${id}`, {
        method: "DELETE",
        });

        load();
        toast.success("Template deleted");
    } catch (err) {
        toast.error("Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">
        {partType.toUpperCase()} Templates
      </h1>

      {/* CREATE */}
      <div className="card">
        <input
          placeholder="Template title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Template content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="lock-row">
          <input
            type="checkbox"
            checked={isLocked}
            onChange={(e) => setIsLocked(e.target.checked)}
          />
          Lock template
        </label>

        <button className="btn-primary" onClick={create}>
          Create Template
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        {list.map((t) => (
          <div key={t._id} className="template-row">
            <div>
              <strong>{t.title}</strong>
              {t.isLocked && <span className="locked"> LOCKED</span>}
              <p>{t.content}</p>
            </div>

            <button
              className="btn-danger"
              onClick={() => remove(t._id, t.isLocked)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
