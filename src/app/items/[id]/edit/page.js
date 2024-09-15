"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function EditItemPage() {
  const { token } = useAuth(); // Hämta token från Auth Context
  const router = useRouter();
  const { id } = useParams(); // Hämta ID från URL:en

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    quantity: 0,
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hämta det item som ska redigeras
  useEffect(() => {
    async function fetchItem() {
      if (!token) {
        setError("No token available");
        return;
      }

      
      try {
        const response = await fetch(`/api/items/${id}`, {
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`, // Skicka JWT-token i anropet för autentisering
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch item");
        }

        const data = await response.json(); // Parsar JSON-svaret
        setItemData(data); // Uppdatera state med itemets data
        setLoading(false); // Laddning är klar
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchItem(); // Kör funktionen för att hämta item när sidan laddas
  }, [id, token]);

  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validera att alla fält är ifyllda innan du skickar PUT-begäran
    if (!itemData.name || !itemData.description || !itemData.quantity || !itemData.category) {
      setError("Please fill in all fields");
      return;
    }

    if (!token) {
      setError("Token is missing");
      return;
    }

    console.log("Token:", token); // Kontrollera att token finns
    console.log("Sending PUT request with data:", itemData); // Kontrollera vad som skickas

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      router.push("/items");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={itemData.name}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg">Description</label>
          <textarea
            id="description"
            name="description"
            value={itemData.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-lg">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={itemData.quantity}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-lg">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={itemData.category}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Item
        </button>
      </form>
    </div>
  );
}