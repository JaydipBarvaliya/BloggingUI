import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "./api/axios";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/categories/${category}`}
            className="block bg-blue-500 text-white py-4 px-6 rounded-lg shadow hover:bg-blue-600"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
