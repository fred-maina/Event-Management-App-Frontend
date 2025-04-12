import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

type ToastType = "success" | "error";

export default function VerifyAccount() {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const showToast = (message: string, type: ToastType) => {
    
    toast[type](message, {
      position: "top-center",
      style: { fontSize: "18px", padding: "16px" },
    });
  };
  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication token missing. Please log in again.", "error");
        setLoading(false);
        return;
      }
  
      const response = await fetch("http://localhost:8080/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "verification-code": parseInt(verificationCode) }),
      });
  
      const data = await response.json();
  
      // Show full message from backend
      if (data.success) {
        showToast("Verification successful! Redirecting...", "success");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        // Directly show the backend error message in the toast
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Verify Your Account</h2>
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter the verification code sent to your email.
        </p>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
