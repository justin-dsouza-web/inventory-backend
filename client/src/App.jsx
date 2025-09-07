// frontend/src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Detect backend URL automatically
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://inventory-backend-self-ten.vercel.app"
    : "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ✅ Edit mode
        await axios.put(`${API_BASE_URL}/api/products/${editingId}`, form);
        toast.success("Product updated!");
        setEditingId(null);
      } else {
        // ✅ Add mode
        await axios.post(`${API_BASE_URL}/api/products`, form);
        toast.success("Product added!");
      }
      setForm({ name: "", price: "", quantity: "", description: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
    });
    setEditingId(product._id);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📦 Inventory App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>

      <h2>Product List</h2>
      <ul>
        {products.map((p) => (
          <li key={p._id} style={{ marginBottom: "10px" }}>
            <b>{p.name}</b> - ₹{p.price} ({p.quantity} pcs) <br />
            <small>{p.description}</small> <br />
            <button
              onClick={() => handleEdit(p)}
              style={{
                marginRight: "5px",
                background: "blue",
                color: "white",
                border: "none",
                padding: "5px",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              style={{
                marginTop: "5px",
                color: "white",
                background: "red",
                border: "none",
                padding: "5px",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
