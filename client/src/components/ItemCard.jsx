import React from "react";
import api from "../api";

export default function ItemCard({ item, onEdit, onDeleted }) {
  const apiRoot = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
  const imgUrl = `${apiRoot}/items/${item.id}/image`;
  const dlUrl = `${apiRoot}/items/${item.id}/download`;

  async function del() {
    if (!confirm("Delete?")) return;
    await api.delete(`/items/${item.id}`);
    onDeleted && onDeleted();
  }

  return (
    <div className="flex gap-4 items-start bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md p-3 card-surface">
      <div className="w-28 h-20 rounded overflow-hidden bg-gray-100 dark:bg-slate-700">
        <img src={imgUrl} alt={item.title} className="img-thumb" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
            <div className="text-xs text-slate-500 dark:text-slate-400">{item.mode} • ₹{item.price}</div>
          </div>

          <div className="text-sm flex gap-3">
            <button onClick={onEdit} className="text-sky-600 dark:text-sky-400">Edit</button>
            <button onClick={del} className="text-red-600 dark:text-red-400">Delete</button>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>

        <div className="mt-3">
          <a href={dlUrl} className="text-sm underline text-slate-700 dark:text-slate-200">Download</a>
        </div>
      </div>
    </div>
  );
}