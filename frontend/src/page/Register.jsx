import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Nom requis"),
  email: Yup.string().email("Email invalide").required("Email requis"),
  number: Yup.string().min(10).max(10).required("Numéro requis"),
  isAdmin: Yup.boolean().required(),
  password: Yup.string()
    .min(6, "Min. 6 caractères")
    .required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
});

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const res = await axios.post("http://localhost:7460/api/auth/register", values);

      if (res.status === 201) {
        toast.success("You are registered 🎉");
        navigate("/login");
      }
    } catch (err) {
      window.alert("Erreur: " + (err?.response?.data?.error?.[0]?.msg || err.message));
      console.log(err);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        number: "",
        isAdmin: false,
        password: "",
        confirmPassword: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4">
          <div className="w-full max-w-md bg-white/80 backdrop-blur shadow-md rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-[#3D5681]">Inscription</h1>

            {/* Username */}
            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full"
              placeholder="Nom d'utilisateur"
              type="text"
              onChange={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
            {touched.username && errors.username && (
              <span className="text-red-500 mb-2 block">{errors.username}</span>
            )}

            {/* Email */}
            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full"
              placeholder="Email"
              type="email"
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <span className="text-red-500 mb-2 block">{errors.email}</span>
            )}

            {/* Number */}
            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full"
              placeholder="Numéro de téléphone"
              type="tel"
              onChange={handleChange("number")}
              onBlur={handleBlur("number")}
              value={values.number}
            />
            {touched.number && errors.number && (
              <span className="text-red-500 mb-2 block">{errors.number}</span>
            )}

            {/* isAdmin */}
            <select
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-4 bg-white w-full"
              value={values.isAdmin}
              onChange={(e) => setFieldValue("isAdmin", e.target.value === "true")}
            >
              <option value={false}>User</option>
              <option value={true}>Admin</option>
            </select>

            {/* Password */}
            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full"
              placeholder="Mot de passe"
              type="password"
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <span className="text-red-500 mb-2 block">{errors.password}</span>
            )}

            {/* Confirm Password */}
            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full"
              placeholder="Confirmer le mot de passe"
              type="password"
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="text-red-500 mb-2 block">{errors.confirmPassword}</span>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              type="button"
              className="bg-[#4299E1] hover:bg-[#377fc2] transition py-3 rounded-lg mt-2 w-full text-white font-semibold"
            >
              S'inscrire
            </button>

            <span
              className="text-[#3D5681] hover:underline text-center mt-4 block cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Vous avez déjà un compte ? Se connecter
            </span>
          </div>
        </div>
      )}
    </Formik>
  );
}