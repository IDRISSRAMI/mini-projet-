import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string().required("Mot de passe requis"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:7460/api/auth/login",
        values
      );

      const newToken = res.data.token;
      if (newToken) {
        toast.success("Vous êtes connecté 🎉");
        login(newToken);
        navigate("/");
      }
    } catch (err) {
      toast.error(
        "Échec de la connexion: " +
          (err?.response?.data?.message || err.message)
      );
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <div className="flex min-h-screen justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100 px-4">
          <div className="w-full max-w-md bg-white/80 backdrop-blur shadow-md rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-[#3D5681]">
              Connexion
            </h1>

            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full placeholder:text-[#89AFD2]"
              placeholder="Email"
              type="email"
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 mb-2 text-sm">{errors.email}</p>
            )}

            <input
              className="border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3 mb-2 bg-white w-full placeholder:text-[#89AFD2]"
              placeholder="Mot de passe"
              type="password"
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              autoComplete="current-password"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 mb-2 text-sm">{errors.password}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#4299E1] hover:bg-[#377fc2] transition py-3 rounded-lg mt-2 w-full text-white font-semibold"
            >
              Se connecter
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#3D5681] hover:underline text-center mt-4 block w-full"
            >
              Pas encore de compte ? S'inscrire
            </button>
          </div>
        </div>
      )}
    </Formik>
  );
}
