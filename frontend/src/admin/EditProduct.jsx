import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          stock: data.stock || "",
        });

        setPreview(data.imageUrl);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append(
        "description",
        formData.description
      );
      data.append("price", formData.price);
      data.append(
        "category",
        formData.category
      );
      data.append("stock", formData.stock);

      if (image) {
        data.append("image", image);
      }

      const res = await fetch(
        `/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: data,
        }
      );

      if (res.ok) {
        toast.success(
          "Product updated successfully!"
        );

        setTimeout(() => {
          navigate("/admin/products");
        }, 1200);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-white">
          Edit Product
        </h1>

        <p className="text-zinc-400 mt-2">
          Update product information
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-zinc-300 mb-2">
              Product Name
            </label>

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
            <label className="block text-zinc-300 mb-2">
              Description
            </label>

            <textarea
              rows="5"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Price + Category */}
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-zinc-300 mb-2">
                Price
              </label>

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
              <label className="block text-zinc-300 mb-2">
                Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category:
                      e.target.value,
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-orange-500"
              >
                <option value="">
                  Select Category
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Headphones">
                  Headphones
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>
            </div>

          </div>

          {/* Stock */}
          <div>
            <label className="block text-zinc-300 mb-2">
              Stock Quantity
            </label>

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

          {/* Image Upload */}
          <div>
            <label className="block text-zinc-300 mb-2">
              Replace Product Image
            </label>

            <div className="border-2 border-dashed border-orange-500/40 rounded-2xl p-6">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files[0];

                  if (file) {
                    setImage(file);

                    setPreview(
                      URL.createObjectURL(
                        file
                      )
                    );
                  }
                }}
                className="text-white"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-5 h-72 w-full object-cover rounded-2xl border border-zinc-800"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              "Update Product"
            )}
          </button>

        </form>

      </div>
    </motion.div>
  );
};

export default EditProduct;