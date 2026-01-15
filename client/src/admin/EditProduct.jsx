import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import toast from "react-hot-toast";
import API_URL from "../config";

const API = `${API_URL}/products`;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // token not explicitly used here but might be needed if extended
  // const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setInitialData(data.product);
      } catch (err) {
        toast.error(err.message);
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <AddProduct
      mode="edit"
      productId={id}
      initialData={initialData}
    />
  );
}
