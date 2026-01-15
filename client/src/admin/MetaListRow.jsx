import React, { useState } from "react";

import toast from "react-hot-toast";

/**
 * Props:
 *  - item { _id, name }
 *  - onUpdate(id, newName)
 *  - onDelete(id)
 */
export default function MetaListRow({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!value.trim()) return toast.error("Name required");
    setSaving(true);
    try {
      await onUpdate(item._id, value.trim());
      setEditing(false);
      toast.success("Updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="meta-row">
      <div className="meta-row-left">
        {editing ? (
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        ) : (
          <span className="meta-name">{item.name}</span>
        )}
      </div>

      <div className="meta-row-actions">
        {editing ? (
          <>
            <button className="btn btn-sm btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-sm" onClick={() => { setEditing(false); setValue(item.name); }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-sm btn-outline" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => { if (confirm("Delete?")) onDelete(item._id); }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
