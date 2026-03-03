import { useState } from "react";
import logo from "/src/assets/images.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";


const Login = () => {
  const navigate = useNavigate();
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    //  else if (formData.password.length < 4) {
    //   newErrors.password = "Password must be at least 4 characters";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleChange = async (e) => {


    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate() || loading) return;

  setLoading(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
        timeout: 10000 // ⏳ network slow ho to bhi handle
      }
    );

    toast.success("Login Successful!", {
      duration: 900,
      style: {
        borderRadius: "10px",
        background: "#fff",
        color: "#065f46",
        fontWeight: "500"
      }
    });

    setTimeout(() => navigate("/"), 900);

  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.code === "ECONNABORTED"
        ? "something wrong, try again"
        : "Login failed";

    toast.error(message, {
      duration: 1200,
      style: {
        borderRadius: "10px",
        background: "#fff",
        color: "#b91c1c",
        fontWeight: "500"
      }
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8838ba] via-[#6f8ccf] to-[#12618c]">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md ">

        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="h-12 w-12 rounded-[10px] shadow-md" />
        </div>

        <h2 className="text-2xl font-bold text-center text-[#2e3ab9e0] mb-6">
          Welcome to Chat App
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg text-sm transition-all duration-200 outline-none ${errors.username
              ? "border-red-500 animate-shake"
              : "border-blue-300 focus:border-blue-600"
              }`}
          />

          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username}
            </p>
          )}


          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              <input
                type={showpassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-xl text-sm transition-all duration-200 outline-none ${errors.password
                  ? "border-red-500 animate-shake"
                  : "border-blue-300 focus:border-blue-600"
                  }`}
              />

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}


              <button
                type="button"
                onClick={() => setshowpassword(!showpassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-medium"
              >
                {showpassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
              </button>
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#2e3ab9e0] text-white py-2 rounded-lg font-semibold hover:bg-[#6e76e7] transition duration-300 flex items-center justify-center"
          >{loading ? "Logging in..." : "Login"}

          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="text-[#2e3ab9e0] hover:underline">
            Create new account
          </span>
        </p>


      </div>
    </div>
  );
};

export default Login;
