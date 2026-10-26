import { useEffect, useState } from "react";
import { api } from "./api";

const EMPTY = { name: "", description: "", price: "", quantity: "" };

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setProducts(await api.list());
      setError("");
    } catch (e) {
      setError("Impossible de joindre l'API : " + e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity || "0", 10),
    };
    setLoading(true);
    try {
      if (editingId) await api.update(editingId, payload);
      else await api.create(payload);
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      quantity: String(p.quantity),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function onDelete(p) {
    if (!window.confirm(`Supprimer « ${p.name} » ?`)) return;
    try {
      await api.remove(p.id);
      if (selected?.id === p.id) setSelected(null);
      if (editingId === p.id) cancelEdit();
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onView(p) {
    try {
      setSelected(await api.get(p.id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <h1>📦 Gestion des produits</h1>

      {error && <div className="error">{error}</div>}

      <form className="card" onSubmit={onSubmit}>
        <h2>{editingId ? `Modifier le produit #${editingId}` : "Ajouter un produit"}</h2>
        <input name="name" placeholder="Nom *" value={form.name} onChange={onChange} required maxLength={100} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} rows={2} />
        <div className="row">
          <input name="price" type="number" step="0.01" min="0" placeholder="Prix *" value={form.price} onChange={onChange} required />
          <input name="quantity" type="number" min="0" placeholder="Quantité" value={form.quantity} onChange={onChange} />
        </div>
        <div className="row">
          <button type="submit" disabled={loading}>{editingId ? "Enregistrer" : "Ajouter"}</button>
          {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Annuler</button>}
        </div>
      </form>

      {selected && (
        <div className="card detail">
          <h2>Détails du produit #{selected.id}</h2>
          <p><b>Nom :</b> {selected.name}</p>
          <p><b>Description :</b> {selected.description || "—"}</p>
          <p><b>Prix :</b> {selected.price.toFixed(2)} €</p>
          <p><b>Quantité :</b> {selected.quantity}</p>
          <p><b>Créé le :</b> {selected.created_at ? new Date(selected.created_at).toLocaleString("fr-FR") : "—"}</p>
          <button className="secondary" onClick={() => setSelected(null)}>Fermer</button>
        </div>
      )}

      <div className="card">
        <h2>Liste des produits ({products.length})</h2>
        {products.length === 0 ? (
          <p className="muted">Aucun produit pour le moment.</p>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>Nom</th><th>Prix</th><th>Qté</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price.toFixed(2)} €</td>
                  <td>{p.quantity}</td>
                  <td className="actions">
                    <button onClick={() => onView(p)}>Voir</button>
                    <button className="warn" onClick={() => startEdit(p)}>Modifier</button>
                    <button className="danger" onClick={() => onDelete(p)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
