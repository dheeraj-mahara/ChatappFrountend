import { useNavigate } from "react-router-dom";
import logo from "/src/assets/images.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";


export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm()

    const password = watch("password");
    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/singup`,
                data,              
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    validateStatus: () => true
                }
            )

            if (!response.data.success) {
                toast.error(response.data.message, {
                    duration: 1200,

                    style: {
                        borderRadius: "10px",
                        background: "#fff",
                        color: "#b91c1c",
                        fontWeight: "500"
                    }
                });
                return;
            }

            toast.success(" Register Successful!", {
                duration: 900,
                style: {
                    borderRadius: "10px",
                    background: "#fff",
                    color: "#065f46",
                    fontWeight: "500"
                }
            });
            navigate("/login");

        } catch (error) {
      toast.error(
        
        error.response?.data?.message || "❌ register Failed!",
        {
           duration: 1200,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#b91c1c",
            fontWeight: "500"
          }
        }
      );
    }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("contact", data.contact);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);

        // formData.append("profilephoto", data.profilephoto[0]);

        console.log("Final FormData", formData);

    }
    return (
        <div className="w-full h-auto min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 via-blue-400 to-cyan-700">

            <div className="bg-white w-[360px] p-7 rounded-xl text-center shadow-xl">

                <div className="flex justify-center mb-4">
                    <img src={logo} alt="logo" className="h-7 w-7 rounded-[10px] shadow-md" />
                </div>
                <p className="text-lg font-bold text-blue-900 mb-5 flex justify-center items-center">
                    Welcome to
                    <img src="/image/images.png" alt="" className="h-[18px] mx-1" />
                    Chat App
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">

                    <input type="text" placeholder="Name"
                        {...register("name", {
                            required: "Name is required",
                            minLength: { value: 3, message: "Name must be at least 3 characters" }
                        })}
                        className={`w-full p-1.5 border rounded-md text-sm transition-all outline-none duration-200 ${errors.name
                            ? "border-red-500 animate-shake"
                            : "border-blue-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.name && (<p className="  text-red-500 text-xs  mt-1">{errors.name.message}</p>)}

        

                    <input type="number" placeholder='Contact No.'
                        {...register("contact", {
                            required: "Contact number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter valid 10 digit number"
                            }
                        })}
                        className={`w-full p-1.5 border rounded-md text-sm transition-all outline-none duration-200 ${errors.contact
                            ? "border-red-500 animate-shake"
                            : "border-blue-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.contact && (<p className="  text-red-500 text-xs">{errors.contact.message}</p>)}

                    <input type="password" placeholder='Enter password '
                        {...register("password", {
                            required: "password is require",
                            minLength: { value: 4, message: "password  must be at least 4 characters" },

                        })}
                        className={`w-full p-1.5 border rounded-md text-sm transition-all outline-none duration-200 ${errors.password
                            ? "border-red-500 animate-shake"
                            : "border-blue-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.password && (<p className="  text-red-500 text-xs">{errors.password.message}</p>)}

                    <input type="password" placeholder='conform password  '
                        {...register("confirmPassword", {
                            required: "conform password is require",
                            validate: value =>
                                value === password || "Passwords do not match"

                        })}
                        className={`w-full p-1.5 border rounded-md text-sm transition-all outline-none duration-200 ${errors.confirmPassword
                            ? "border-red-500 animate-shake"
                            : "border-blue-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.confirmPassword && (<p className="  text-red-500 text-xs">{errors.confirmPassword.message}</p>)}

                    <button
                        type="submit" className="w-full p-3 bg-blue-700 text-white font-bold rounded-full transition duration-300 hover:bg-purple-700"
                    >
                        Create Account
                    </button>

                </form>

                <p onClick={() => navigate("/login")} className="block mt-3 text-sm text-blue-700 hover:underline">
                    Login with account
                </p>

            </div>
        </div>
    )
}
