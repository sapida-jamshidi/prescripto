import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

import { useState } from "react";


import {

  UserRound,

  Mail,

  LockKeyhole,

  Eye,

  EyeOff,

  Stethoscope,

  CheckCircle2,

  AlertCircle,

} from "lucide-react";



function Login() {

  const navigate = useNavigate();
  const location = useLocation();

const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(false);



  const [showPassword, setShowPassword] = useState(false);



  const [formData, setFormData] = useState({

    name: "",

    email: "",

    password: "",

    confirmPassword: "",

  });



  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");



  function handleChange(event) {

    const { name, value } = event.target;



    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));



    setErrors((prev) => ({

      ...prev,

      [name]: "",

    }));



    setMessage("");

  }



  function validateForm() {

    const newErrors = {};



    if (!isLogin && formData.name.trim().length < 2) {

      newErrors.name = "Name must contain at least 2 characters.";

    }



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!emailRegex.test(formData.email.trim())) {

      newErrors.email = "Please enter a valid email address.";

    }



    if (formData.password.length < 8) {

      newErrors.password = "Password must contain at least 8 characters.";

    }



    if (

      !isLogin &&

      formData.password !== formData.confirmPassword

    ) {

      newErrors.confirmPassword = "Passwords do not match.";

    }



    setErrors(newErrors);



    return Object.keys(newErrors).length === 0;

  }



function handleSubmit(event) {

  event.preventDefault();



  if (!validateForm()) return;



  const email = formData.email.trim();



  // Frontend demo only — no real authentication

  const demoUser = {

    name: isLogin

      ? email.split("@")[0]

      : formData.name.trim(),

    email,

  };



  try {

    login(demoUser);



    setFormData({

      name: "",

      email: "",

      password: "",

      confirmPassword: "",

    });



    const from = location.state?.from;
    const destination = from?.pathname?.startsWith("/") && !from.pathname.startsWith("//")
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : "/my-profile";

    navigate(destination, { replace: true });

  } catch {

    setMessage(

      "Unable to save demo session. Please try again."

    );

  }

}

  function switchMode() {

    setIsLogin((prev) => !prev);



    setErrors({});

    setMessage("");

    setShowPassword(false);



    setFormData({

      name: "",

      email: "",

      password: "",

      confirmPassword: "",

    });

  }



  return (

    <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12">



      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10">



        {/* Logo */}

        <Link

          to="/"

          className="mb-8 flex items-center justify-center gap-2"

        >

          <Stethoscope size={32} className="text-primary" />



          <span className="text-2xl font-bold text-gray-800">

            Prescripto

          </span>

        </Link>



        {/* Heading */}

        <h1 className="text-2xl font-semibold text-gray-800">

          {isLogin ? "Login" : "Create Account"}

        </h1>



        <p className="mt-2 text-sm text-gray-500">

          {isLogin

            ? "Please log in to book appointments."

            : "Please sign up to book appointments."}

        </p>



        {/* Form */}

        <form

          onSubmit={handleSubmit}

          noValidate

          className="mt-8 space-y-5"

        >



          {/* Full Name */}

          {!isLogin && (

            <div>

              <label

                htmlFor="auth-name"

                className="mb-2 block text-sm font-medium text-gray-700"

              >

                Full Name

              </label>



              <div className="relative">

                <UserRound

                  size={19}

                  className="absolute left-3 top-3.5 text-gray-400"

                />



                <input

                  id="auth-name"

                  type="text"

                  name="name"

                  value={formData.name}

                  onChange={handleChange}

                  placeholder="Enter your full name"

                  autoComplete="name"

                  className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-primary"

                />

              </div>



              {errors.name && (

                <p className="mt-2 text-sm text-red-500">

                  {errors.name}

                </p>

              )}

            </div>

          )}



          {/* Email */}

          <div>

            <label

              htmlFor="auth-email"

              className="mb-2 block text-sm font-medium text-gray-700"

            >

              Email Address

            </label>



            <div className="relative">

              <Mail

                size={19}

                className="absolute left-3 top-3.5 text-gray-400"

              />



              <input

                id="auth-email"

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}

                placeholder="Enter your email"

                autoComplete="email"

                className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-primary"

              />

            </div>



            {errors.email && (

              <p className="mt-2 text-sm text-red-500">

                {errors.email}

              </p>

            )}

          </div>



          {/* Password */}

          <div>

            <label

              htmlFor="auth-password"

              className="mb-2 block text-sm font-medium text-gray-700"

            >

              Password

            </label>



            <div className="relative">

              <LockKeyhole

                size={19}

                className="absolute left-3 top-3.5 text-gray-400"

              />



              <input

                id="auth-password"

                type={showPassword ? "text" : "password"}

                name="password"

                value={formData.password}

                onChange={handleChange}

                placeholder="Enter your password"

                autoComplete={

                  isLogin ? "current-password" : "new-password"

                }

                className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-12 outline-none focus:border-primary"

              />



              <button

                type="button"

                onClick={() => setShowPassword((prev) => !prev)}

                aria-label={

                  showPassword ? "Hide password" : "Show password"

                }

                className="absolute right-3 top-3.5 text-gray-400 hover:text-primary"

              >

                {showPassword ? (

                  <EyeOff size={19} />

                ) : (

                  <Eye size={19} />

                )}

              </button>

            </div>



            {errors.password && (

              <p className="mt-2 text-sm text-red-500">

                {errors.password}

              </p>

            )}

          </div>



          {/* Confirm Password */}

          {!isLogin && (

            <div>

              <label

                htmlFor="auth-confirm-password"

                className="mb-2 block text-sm font-medium text-gray-700"

              >

                Confirm Password

              </label>



              <input

                id="auth-confirm-password"

                type={showPassword ? "text" : "password"}

                name="confirmPassword"

                value={formData.confirmPassword}

                onChange={handleChange}

                placeholder="Confirm your password"

                autoComplete="new-password"

                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"

              />



              {errors.confirmPassword && (

                <p className="mt-2 text-sm text-red-500">

                  {errors.confirmPassword}

                </p>

              )}

            </div>

          )}



          {/* Submit Button */}

          <button

            type="submit"

            className="w-full rounded-lg bg-primary py-3.5 font-medium text-white transition hover:opacity-90"

          >

            {isLogin ? "Login" : "Create Account"}

          </button>



          {/* Success Message */}

          {message && (

            <div

              role="status"

              className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"

            >

              <CheckCircle2 size={20} className="shrink-0" />

              <p>{message}</p>

            </div>

          )}

        </form>



        {/* Switch Login/Register */}

        <p className="mt-7 text-center text-sm text-gray-600">

          {isLogin

            ? "Don't have an account?"

            : "Already have an account?"}



          <button

            type="button"

            onClick={switchMode}

            className="ml-2 font-medium text-primary underline"

          >

            {isLogin ? "Create Account" : "Login"}

          </button>

        </p>



        {/* Demo Notice */}

        <div className="mt-7 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">

          <AlertCircle size={17} className="shrink-0" />

          <p>

            Frontend demonstration only. No real account is

            created and no password is stored or sent.

          </p>

        </div>



      </div>

    </main>

  );

}

export default Login;
