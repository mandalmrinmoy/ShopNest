import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Please select an image");
    }

    setLoading(true);

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("image", image);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success("Product created successfully!");

        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
        });

        setImage(null);
        setPreview(null);

        setTimeout(() => {
          navigate("/shop");
        }, 1500);
      } else {
        toast.error(responseData.message || "Error creating product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="max-w-5xl mx-auto px-5 py-10"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Add Product</h1>

        <p className="text-zinc-400 mt-2">Publish a new product to ShopNest</p>
      </div>

      {/* Card */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-zinc-300 mb-2">Product Name</label>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-300 mb-2">Description</label>

            <textarea
              rows="5"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Price + Category */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-zinc-300 mb-2">Price</label>

              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-2">Category</label>

              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
              >
                <option value="">Select Category</option>

                <option value="Mobile">Mobile</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Smart Watch">Smart Watch</option>
                <option value="Monitor">Monitor</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-zinc-300 mb-2">Stock Quantity</label>

            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block text-zinc-300 mb-2">Product Image</label>

            <div className="border-2 border-dashed border-orange-500/40 rounded-2xl p-6">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="text-black bg-white w-23.5 h-10 p-2 rounded-lg"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-5 w-full h-72 object-cover rounded-2xl border border-zinc-800"
              />
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-3">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              "Publish Product"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProduct;
