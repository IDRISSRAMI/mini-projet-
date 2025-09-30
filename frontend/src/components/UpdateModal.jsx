import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

const UpdateSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  number: Yup.string().required("Phone number is required"),
  password: Yup.string().required("Password is required to confirm changes"),
});

export default function UpdateModal({ visible, onClose }) {
  const { user, token, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:7460/api/edit-info/${user._id}`,
        {
          username: values.username || user.username,
          email: values.email || user.email,
          number: values.number || user.number,
          confirmationPassword: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setUser(res.data.updatedUser);
        toast.success("Info updated successfully!");
        resetForm();
        onClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error("Update error:", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 z-50">
      <div className="bg-white/90 backdrop-blur p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Update Info
        </h2>

        <Formik
          initialValues={{
            username: user.username,
            email: user.email,
            number: user.number,
            password: "",
          }}
          validationSchema={UpdateSchema}
          onSubmit={handleUpdate}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 outline-none"
                  value={values.username}
                  onChange={handleChange("username")}
                  onBlur={handleBlur("username")}
                />
                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 outline-none"
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 outline-none"
                  value={values.number}
                  onChange={handleChange("number")}
                  onBlur={handleBlur("number")}
                />
                {touched.number && errors.number && (
                  <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 outline-none"
                  value={values.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Updating..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-300 py-3 rounded-xl text-gray-800 font-medium"
              >
                Cancel
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
