"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function CreateItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !description || !category || quantity <= 0) {
      setError("Please fill in all fields and ensure quantity is greater than 0");
      return;
    }

    console.log("Token:", token);

    // Kolla om token finns, annars visa fel
    if (!token) {
      setError("You must be logged in to create an item");
      return;
    }

    try {

      console.log("Sending POST request with data:", {
        name,
        description,
        quantity: parseInt(quantity, 10),
        category,
      }); // Logga vad som skickas


    const response = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        quantity: parseInt(quantity, 10),
        category,
      }),
    });

    console.log("Response from server:", response); // Logga svaret från servern

    if (response.ok) {
      router.push("/items");
    } else {
      const errorData = await response.json();

      console.error("Error from server:", errorData); // Logga fel från servern

      setError(errorData.message || "Failed to create item");
    }
  } catch (err) {
    setError("Error occured while creating item");
    console.error("Error caught in catch:", err);
  }
}

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Create New Item</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Item Description"
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Item
      </button>
    </form>
  );
}


/*"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function CreateItemPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const { token } = useAuth();
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const response = await fetch("/api/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
                quantity: parseInt(quantity, 10),
                category
            }),
        });

        
        if (response.ok) {
          router.push("/items"); 
        } else {
          const data = await response.json();
          setError(data.message || "Failed to create item");
        }
      }
    
      return (
        <div>
          <h1>Create New Item</h1>
          <form onSubmit={handleCreate}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            {error && <p>{error}</p>}
            <button type="submit">Create Item</button>
          </form>
        </div>
      );
    }
*/