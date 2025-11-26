import React, { useEffect, useState } from "react";
import api from "./api";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import './index.css';

export default function App() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("dg_theme");
      if (saved) return saved;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch { return "light"; }
  });

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("dg_theme", theme);
  }, [theme]);

  async function load() {
    try {
      const res = await api.get("/items");
      const newItems = res?.data?.items ?? [];
      setItems(prev => {
        if (!prev || prev.length !== newItems.length) return newItems;
        const same = prev.every((p, i) => p.id === newItems[i].id);
        return same ? prev : newItems;
      });
    } catch (err) {
      console.error("Failed to load items", err);
      setItems([]);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => { mounted = false; };
    // empty deps => run once on mount
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Digvijay Express</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Rail & Air cargo — manage shipments</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
              className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <main className="app-grid grid app-grid">
          <div>
            <div className="card-surface bg-white dark:bg-slate-800 p-6">
              <ItemForm editing={editing} onDone={() => { load(); setEditing(null); }} />
            </div>
          </div>

          <aside>
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="p-6 card-surface bg-white dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-300">
                  No shipments yet — add one using the form.
                </div>
              ) : (
                items.map(it => (
                  <ItemCard key={it.id} item={it} onEdit={() => setEditing(it)} onDeleted={() => load()} />
                ))
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
