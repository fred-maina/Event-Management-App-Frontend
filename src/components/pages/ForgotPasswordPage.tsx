import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { InputOTP,InputOTPSlot,InputOTPGroup } from "@/components/ui/input-otp";

const BASE_URL = "http://localhost:8080/api/auth";

type ToastType = "success" | "error";

export default function ForgotPassword() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const showToast = (message: string, type: ToastType) => {
    toast[type](message, {
      duration: 5000,
      position: "top-center", // Moves toaster to the top
      icon: type === "success" ? "✅" : "❌", // Adds checkmark for success and red X for errors
      style: { fontSize: "18px", padding: "16px" } // Makes it larger
    });
  };
  

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      showToast("A verification code has been sent to your email. Please check your inbox and enter the code below.", "success");
      setStep(2);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/upload-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      showToast("Your verification code is correct. You can now set a new password.", "success");
      setToken(data.token);
      setStep(3);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Invalid code, please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please ensure both fields match.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      showToast("Your password has been successfully reset! Redirecting to login page...", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Reset failed, please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter Verification Code"}
            {step === 3 && "Reset Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <p className="text-gray-600 text-sm">Enter your registered email address. We will send you a verification code to reset your password.</p>
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Code"}</Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-gray-600 text-sm">Check your email for the verification code and enter it below.</p>
              <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
            <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>

              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify Code"}</Button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-gray-600 text-sm">Enter a new password for your account and confirm it.</p>
              <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
