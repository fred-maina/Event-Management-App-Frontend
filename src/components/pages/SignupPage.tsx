import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import backgroundImage from "@/assets/PeopleAtAConcert.jpg";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);
      const { success, message, user, token } = response.data;

      if (success) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        toast.success(message || "Registration successful! Redirecting...");
        setTimeout(() => navigate("/verify"), 3000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-center h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 text-center text-white px-6 md:px-12">
        <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="text-4xl md:text-6xl font-bold mb-6">
          Create Your Account
        </motion.h1>
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }} className="text-lg md:text-xl mb-10">
          Join the movement and create unforgettable events.
        </motion.p>
        <Card className="max-w-md mx-auto bg-white bg-opacity-80 rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-[#0d6efd]">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none" required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none" required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none" required />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none" required />
                <button type="button" className="absolute right-3 top-3" onClick={togglePasswordVisibility}>{showPassword ? <EyeOff /> : <Eye />}</button>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="px-4 py-3 rounded-md text-lg w-full border-2 border-gray-300 focus:border-[#0d6efd] focus:outline-none" required />
                <button type="button" className="absolute right-3 top-3" onClick={togglePasswordVisibility}>{showPassword ? <EyeOff /> : <Eye />}</button>
              </div>
              <Button type="submit" className="bg-[#0d6efd] text-white px-8 py-4 text-lg rounded-full mt-6" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="mt-4 text-sm text-black">
              Already have an account? <a href="/login" className="text-[#0d6efd] hover:underline">Sign In</a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      <ToastContainer />
    </section>
  );
}
