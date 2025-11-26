import React, { useEffect, useState } from "react";
import api from "../api";

export default function ItemForm({ onDone, editing }) {
  const empty = { title: "", description: "", mode: "rail", price: "" };
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      const next = {
        title: editing.title || "",
        description: editing.description || "",
        mode: editing.mode || "rail",
        price: editing.price ?? ""
      };
      const needUpdate =
        form.title !== next.title ||
        form.description !== next.description ||
        form.mode !== next.mode ||
        String(form.price) !== String(next.price);
      if (needUpdate) setForm(next);
    } else {
      const needClear =
        form.title !== empty.title ||
        form.description !== empty.description ||
        form.mode !== empty.mode ||
        String(form.price) !== String(empty.price);
      if (needClear) setForm(empty);
      setFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("mode", form.mode);
      fd.append("price", form.price || 0);
      if (file) fd.append("image", file);

      if (editing) await api.put(`/items/${editing.id}`, fd);
      else await api.post("/items", fd);

      setForm(empty);
      setFile(null);
      onDone && onDone();
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">New Shipment</h2>

      <input
        value={form.title}
        onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Title"
        className="block w-full mb-1 border border-gray-200 dark:border-slate-700 rounded-md px-3 py-3 bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 input-focus"
        required
      />

      <textarea
        value={form.description}
        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Description"
        rows={4}
        className="block w-full border border-gray-200 dark:border-slate-700 rounded-md px-3 py-3 bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 input-focus"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={form.mode}
          onChange={e => setForm(prev => ({ ...prev, mode: e.target.value }))}
          className="h-11 px-3 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-sm"
        >
          <option value="rail">Rail</option>
          <option value="air">Air</option>
          <option value="sea">Sea</option>
        </select>

        <input
          value={form.price}
          onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
          placeholder="Price"
          type="number"
          className="h-11 px-3 flex-1 min-w-[120px] rounded-md border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
        />

        <div className="file-input-wrapper">
          <label className="file-input-button">
            Choose File
            <input type="file" accept="image/*" className="sr-only" onChange={e => setFile(e.target.files[0] || null)} />
          </label>
          <div className="file-input-name">{file ? file.name : "No file chosen"}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button disabled={submitting} className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">
          {submitting ? "Saving…" : "Save"}
        </button>

        <button type="button" onClick={() => { setForm(empty); setFile(null); }} className="px-4 py-2 rounded-md border">
          Reset
        </button>
      </div>
    </form>
  );
}