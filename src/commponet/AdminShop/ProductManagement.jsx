import { useEffect, useState } from "react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  useEffect(() => {
    fetch("http://192.168.29.2:7210/api/v1/product/list-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search: "" }),
    })
      .then(res => res.json())
      .then(data => setProducts(data.data.list))
      .catch(err => console.error(err));
  }, []);

  const handleAdd = async () => {
    const res = await fetch("http://192.168.29.2:7210/api/v1/product/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    if (res.ok) {
      setProducts([...products, data]);
      setNewProduct({ name: "", price: "" });
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      <input type="text" placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input type="number" placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <button onClick={handleAdd}>Add Product</button>

      <ul>
        {products.map((p) => (
          <li key={p._id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
