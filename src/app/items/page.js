"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { token, logout } = useAuth();
  const router = useRouter();


  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("/api/items"); /*{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });*/

        if (response.ok) {
          const data = await response.json();
          setItems(data);
          console.log("Fetched items:", data);
        } else {
          const errorData = await response.json();
          console.error("Error fetching items:", errorData.message);
          setError(errorData.message);
        }
      } catch (err) {
        console.error("Error fetching items here:", err.message); // Hantera fel som kastas
        setError(err.message);
      } finally {
        setLoading(false); // Avsluta laddningen
      }

      }
        
    fetchItems();
    }, [/*token*/]);

    function handleLogout() {
      logout(); 
      router.push("/auth/login");
    }
  
    async function handleDelete(id) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json(); 
          console.error("Failed to delete item:", errorData.message);
          setError(errorData.message);
          return;
        }
  
        setItems(items.filter((item) => item.id !== id)); 
      } catch (err) {
        console.error("Failed to delete item:", err.message); 
      }
    }
  
    function handleEdit(id) {
      router.push(`/items/${id}/edit`); 
    }
  
    function handleCreate() {
      router.push("/items/create");
    }
  
    
    if (loading) {
      return <p>Loading...</p>; 
    }
  
    if (error) {
      return <p>Error: {error}</p>; 
    }
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Items</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Create New Item
        </button>
  
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p>{item.description}</p>
              <p>Quantity: {item.quantity}</p>
  
              <button
                onClick={() => handleEdit(item.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Log out
        </button>
      </div>
    );
  }

