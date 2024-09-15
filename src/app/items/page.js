"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStock, setInStock] = useState([""]);
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchItems() {
      try {
        const categoryQuery = selectedCategories.length ? `category=${selectedCategories.join(",")}` : "";
        const inStockQuery = inStock ? `inStock=${inStock}` : "";
        //const queryString = categoryQuery ? `?${categoryQuery}` : "";
        const queryString = [categoryQuery, inStockQuery].filter(Boolean).join("&");

        //const response = await fetch(`/api/items${queryString}`);
        const response = await fetch(`/api/items${queryString ? `?${queryString}` : ""}`);

        if (response.ok) {
          const data = await response.json();
          setItems(data);

          //Extract cats dynamicaly
          const uniqueCategories = [...new Set(data.map((item) => item.category))];
          setCategories(uniqueCategories);

          console.log("Fetched items:", data);
        } else {
          const errorData = await response.json();
          console.error("Error fetching items:", errorData.message);
          setError(errorData.message);
        }
      } catch (err) {
        console.error("Error fetching items here:", err.message); 
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    }
        
    fetchItems();
    }, [selectedCategories, inStock]);

    function handleCategoryChange(category) {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category)
          : [...prev, category]
      );
    }

    function handleInStockChange(value) {
      setInStock(value);
    }

    function handleLogout() {
      logout(); 
      router.push("/auth/login");
    }
  
    async function handleDelete(id) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
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

        <div className="mb-4">
          <h2 className="font-semibold">Filter Items:</h2>

        
        <div>
          <h3>Categories:</h3>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={
                  selectedCategories.includes(category)
                    ? "bg-blue-500 text-white p-2 rounded m-2"
                    : "p-2 m-2 border"
                }
              >
                {category}
              </button>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>

        
        <div>
          <h3>In Stock:</h3>
          <button
            onClick={() => handleInStockChange("true")}
            className={inStock === "true" ? "bg-green-500 text-white p-2 rounded" : "p-2"}
          >
            In Stock
          </button>
          <button
            onClick={() => handleInStockChange("false")}
            className={inStock === "false" ? "bg-red-500 text-white p-2 rounded" : "p-2"}
          >
            Out of Stock
          </button>
          <button
            onClick={() => handleInStockChange("")}
            className={inStock === "" ? "bg-gray-500 text-white p-2 rounded" : "p-2"}
          >
            All
          </button>
        </div>
      </div>

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
