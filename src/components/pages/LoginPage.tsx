import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import backgroundImage from "@/assets/PeopleAtAConcert.jpg";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", formData);
      const { success, message, user, token } = response.data;

      if (success) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        toast.success(message || "Login successful!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative flex items-center justify-center h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white px-6 md:px-12"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl mb-6"
        >
          Let's pick up where you left off.
        </motion.p>
        <Card className="max-w-md mx-auto p-6 bg-white bg-opacity-80 rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-[#0d6efd]">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={24} color="#0d6efd" /> : <Eye size={24} color="#0d6efd" />}
                </button>
              </div>
              <Button
                type="submit"
                className="bg-[#0d6efd] text-white px-8 py-4 text-lg rounded-full mt-6 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : "Sign In"}
              </Button>
            </motion.form>
          </CardContent>
          <CardFooter>
            <div className="mt-6 text-center text-sm">
              <p className="mb-3">
                Don't have an account? <a href="/signup" className="text-[#0d6efd] hover:underline">Sign Up</a>
              </p>
              <p className="mt-2">
                <a href="/forgot-password" className="text-[#0d6efd] hover:underline">Forgot Password?</a>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}
