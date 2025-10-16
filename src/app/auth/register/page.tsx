"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShoppingBag, Sparkles, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { global } from "styled-jsx/css";


export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { text: "At least 6 characters", met: password.length >= 6 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { text: "Contains number", met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({ 
        title: "All fields are required", 
        variant: "destructive",
        description: "Please fill in all the fields to create your account."
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        variant: "destructive",
        description: "Please make sure both passwords are identical."
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({ 
        title: "Password too short", 
        variant: "destructive",
        description: "Password must be at least 6 characters long."
      });
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Firebase Auth signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Update display name
      await updateProfile(user, { displayName: name });

      // 3️⃣ Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          emailNotifications: true,
          newsletter: true,
        }
      });

      toast({ 
        title: "Welcome to ShopSmart! 🎉",
        description: "Your account has been created successfully."
      });
      router.push("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      let errorDescription = "An unexpected error occurred during registration.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email already registered";
          errorDescription = "This email address is already associated with an account. Please try logging in instead.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          errorDescription = "Please enter a valid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Registration disabled";
          errorDescription = "Email/password accounts are not enabled. Please contact support.";
          break;
        case 'auth/weak-password':
          errorMessage = "Weak password";
          errorDescription = "Please choose a stronger password with at least 6 characters.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error";
          errorDescription = "Please check your internet connection and try again.";
          break;
      }
      
      toast({ 
        title: errorMessage, 
        variant: "destructive",
        description: errorDescription
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="bg-green-600 p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shop<span className="text-green-600">Smart</span>
              </h1>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Join ShopSmart</h2>
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Create your account and start your premium shopping experience today
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Form */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 pr-4 py-3 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-3 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 py-3 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-12 py-3 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Register Button */}
                  <Button 
                    type="submit" 
                    className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      href="/auth/login" 
                      className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits & Password Requirements */}
            <div className="space-y-6">
              {/* Password Requirements */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Password Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle 
                        className={`h-4 w-4 ${
                          req.met ? "text-green-500" : "text-gray-300"
                        }`} 
                      />
                      <span className={`text-sm ${
                        req.met ? "text-green-600 font-medium" : "text-gray-500"
                      }`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Why Join ShopSmart?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "🎁 Exclusive member-only deals and discounts",
                    "🚚 Free shipping on orders over $50",
                    "⭐ Early access to new products and sales",
                    "💝 Personalized product recommendations",
                    "🔒 Secure and fast checkout process",
                    "📦 Order tracking and delivery updates"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              🔒 By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Your personal data will be protected and never shared with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}