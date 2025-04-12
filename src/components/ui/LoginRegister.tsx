import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [loading, setLoading] = useState(false); // Spinner state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [userDetails, setUserDetails] = useState<any>(null); // Store user details after login

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    try {
      const response = await axios.post(endpoint, formData);
      const { success, user, token } = response.data;

      if (success) {
        // Save user details and token
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUserDetails(user);
      } else {
        alert("Authentication failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userDetails) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome, {userDetails.firstName}!</h1>
          <p>Email: {userDetails.email}</p>
          <p>ID: {userDetails.id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 transition-all duration-300">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-blue-500 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>

        <div className="mt-4 flex flex-col space-y-2">
          <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
            Sign in with Google
          </button>
          <button className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition">
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
