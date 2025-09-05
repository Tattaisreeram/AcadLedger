
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/hooks/use-toast";

// interface SignupSigninProps {
//   onLogin: (data: any) => void;
// }

// const SignupSignin = ({ onLogin }: SignupSigninProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [signupData, setSignupData] = useState({
//     collegeName: "",
//     email: "",
//     walletAddress: "",
//     password: "",
//     confirmPassword: "",
//     logo: null as File | null
//   });
//   const [signinData, setSigninData] = useState({
//     email: "",
//     password: ""
//   });

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (signupData.password !== signupData.confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Passwords do not match",
//         variant: "destructive"
//       });
//       setIsLoading(false);
//       return;
//     }

//     // Simulate API call
//     setTimeout(() => {
//       const collegeData = {
//         id: Date.now(),
//         collegeName: signupData.collegeName,
//         email: signupData.email,
//         walletAddress: signupData.walletAddress,
//         logo: signupData.logo ? URL.createObjectURL(signupData.logo) : null,
//         createdAt: new Date().toISOString()
//       };

//       // Store in localStorage (in real app, this would be on backend)
//       localStorage.setItem(`college_${signupData.email}`, JSON.stringify(collegeData));

//       toast({
//         title: "Success",
//         description: "Account created successfully!"
//       });

//       onLogin(collegeData);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleSignin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       const storedData = localStorage.getItem(`college_${signinData.email}`);

//       if (storedData) {
//         const collegeData = JSON.parse(storedData);
//         toast({
//           title: "Success",
//           description: "Logged in successfully!"
//         });
//         onLogin(collegeData);
//       } else {
//         toast({
//           title: "Error",
//           description: "Invalid credentials",
//           variant: "destructive"
//         });
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSignupData({ ...signupData, logo: e.target.files[0] });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             CertifiChain
//           </h1>
//           <p className="text-gray-300">Decentralized Certificate Management</p>
//         </div>

//         <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
//           <Tabs defaultValue="signin" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 bg-slate-700">
//               <TabsTrigger value="signin" className="data-[state=active]:bg-cyan-600">Sign In</TabsTrigger>
//               <TabsTrigger value="signup" className="data-[state=active]:bg-cyan-600">Sign Up</TabsTrigger>
//             </TabsList>

//             <TabsContent value="signin">
//               <CardHeader>
//                 <CardTitle className="text-white">Welcome Back</CardTitle>
//                 <CardDescription className="text-gray-400">
//                   Sign in to your college account
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSignin} className="space-y-4">
//                   <div>
//                     <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
//                     <Input
//                       id="signin-email"
//                       type="email"
//                       value={signinData.email}
//                       onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
//                     <Input
//                       id="signin-password"
//                       type="password"
//                       value={signinData.password}
//                       onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       required
//                     />
//                   </div>
//                   <Button 
//                     type="submit" 
//                     className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Signing In..." : "Sign In"}
//                   </Button>
//                 </form>
//               </CardContent>
//             </TabsContent>

//             <TabsContent value="signup">
//               <CardHeader>
//                 <CardTitle className="text-white">Create Account</CardTitle>
//                 <CardDescription className="text-gray-400">
//                   Register your college for certificate management
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSignup} className="space-y-4">
//                   <div>
//                     <Label htmlFor="college-name" className="text-gray-300">College Name</Label>
//                     <Input
//                       id="college-name"
//                       value={signupData.collegeName}
//                       onChange={(e) => setSignupData({ ...signupData, collegeName: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="email" className="text-gray-300">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={signupData.email}
//                       onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="wallet" className="text-gray-300">Wallet Address</Label>
//                     <Input
//                       id="wallet"
//                       value={signupData.walletAddress}
//                       onChange={(e) => setSignupData({ ...signupData, walletAddress: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       placeholder="0x..."
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="logo" className="text-gray-300">College Logo</Label>
//                     <Input
//                       id="logo"
//                       type="file"
//                       onChange={handleFileChange}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       accept="image/*"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="password" className="text-gray-300">Password</Label>
//                     <Input
//                       id="password"
//                       type="password"
//                       value={signupData.password}
//                       onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
//                     <Input
//                       id="confirm-password"
//                       type="password"
//                       value={signupData.confirmPassword}
//                       onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
//                       className="bg-slate-700 border-slate-600 text-white"
//                       required
//                     />
//                   </div>
//                   <Button 
//                     type="submit" 
//                     className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Creating Account..." : "Create Account"}
//                   </Button>
//                 </form>
//               </CardContent>
//             </TabsContent>
//           </Tabs>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default SignupSignin;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Upload } from 'lucide-react';
// import AnimatedCube from '@/components/AnimatedCube';


// const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL!;

// interface FormData {
//   collegeName: string;
//   email: string;
//   walletAddress: string;
//   password: string;
//   logo: File | null;
// }

// const defaultForm: FormData = {
//   collegeName: "",
//   email: "",
//   walletAddress: "",
//   password: "",
//   logo: null,
// };


// const AuthPage = () => {
//   const navigate = useNavigate();
//    const [formData, setFormData] = useState<FormData>(defaultForm);
//   const [logoPreview, setLogoPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//    const handleInputChange = (
//     field: keyof FormData,
//     value: string | File | null
//   ) => setFormData((prev) => ({ ...prev, [field]: value }));

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, logo: file }));

//       // Create preview URL
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setLogoPreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSignIn = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     // Store auth data in localStorage for demo
//     localStorage.setItem('acadledger_user', JSON.stringify({
//       collegeName: formData.collegeName || 'Demo University',
//       email: formData.email,
//       walletAddress: formData.walletAddress || '0x742d35Cc6232DCd532d84a012CFB6A'
//     }));

//     toast.success('Welcome to AcadLedger!');
//     navigate('/dashboard');
//   };

//   const handleSignUp = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.collegeName || !formData.email || !formData.walletAddress || !formData.password) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     localStorage.setItem('acadledger_user', JSON.stringify({
//       collegeName: formData.collegeName,
//       email: formData.email,
//       walletAddress: formData.walletAddress,
//       logoUrl: logoPreview
//     }));

//     toast.success('Account created successfully!');
//     navigate('/dashboard');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="w-full max-w-md glassmorphic border-slate-700/50 animate-fade-in">
//         <CardHeader className="text-center">
//           <AnimatedCube />
//           <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             AcadLedger
//           </CardTitle>
//           <CardDescription className="text-slate-400">
//             Secure certificate minting platform for universities
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Tabs defaultValue="signin" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
//               <TabsTrigger value="signin" className="data-[state=active]:bg-slate-700">Sign In</TabsTrigger>
//               <TabsTrigger value="signup" className="data-[state=active]:bg-slate-700">Sign Up</TabsTrigger>
//             </TabsList>

//             <TabsContent value="signin" className="space-y-4 mt-6">
//               <form onSubmit={handleSignIn} className="space-y-4">
//                 <div>
//                   <Label htmlFor="signin-email">Email</Label>
//                   <Input
//                     id="signin-email"
//                     type="email"
//                     placeholder="university@example.edu"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="signin-password">Password</Label>
//                   <Input
//                     id="signin-password"
//                     type="password"
//                     value={formData.password}
//                     onChange={(e) => handleInputChange('password', e.target.value)}
//                     className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
//                   />
//                 </div>
//                 <Button type="submit" className="w-full gradient-cyan-purple hover-scale">
//                   Sign In
//                 </Button>
//               </form>
//             </TabsContent>

//             <TabsContent value="signup" className="space-y-4 mt-6">
//               <form onSubmit={handleSignUp} className="space-y-4">
//                 <div>
//                   <Label htmlFor="college-name">College Name</Label>
//                   <Input
//                     id="college-name"
//                     placeholder="University of Example"
//                     value={formData.collegeName}
//                     onChange={(e) => handleInputChange('collegeName', e.target.value)}
//                     className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="signup-email">Email</Label>
//                   <Input
//                     id="signup-email"
//                     type="email"
//                     placeholder="admin@university.edu"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="wallet-address">Wallet Address</Label>
//                   <Input
//                     id="wallet-address"
//                     placeholder="0x742d35Cc6232DCd532d84a012CFB6A"
//                     value={formData.walletAddress}
//                     onChange={(e) => handleInputChange('walletAddress', e.target.value)}
//                     className="bg-slate-800/50 border-slate-600 focus:border-cyan-500 font-mono text-sm"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="signup-password">Password</Label>
//                   <Input
//                     id="signup-password"
//                     type="password"
//                     value={formData.password}
//                     onChange={(e) => handleInputChange('password', e.target.value)}
//                     className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="logo-upload">Logo Upload</Label>
//                   <div className="relative">
//                     <Input
//                       id="logo-upload"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
//                     />
//                     <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                   </div>
//                   {logoPreview && (
//                     <div className="mt-2 flex items-center space-x-2">
//                       <img 
//                         src={logoPreview} 
//                         alt="Logo preview" 
//                         className="w-8 h-8 rounded object-cover border border-slate-600"
//                       />
//                       <p className="text-sm text-cyan-400">
//                         Logo uploaded: {formData.logo?.name}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//                 <Button type="submit" className="w-full gradient-cyan-purple hover-scale">
//                   Create Account
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AuthPage;


/* ------------------------------------------------------------------
   src/pages/AuthPage.tsx
------------------------------------------------------------------ */
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload } from "lucide-react";

/* tiny animated cube you already have in your project */
import AnimatedCube from "@/components/AnimatedCube";

const BACKEND_URL = "http://localhost:5000"!;

/* -------------- helpers -------------- */
interface CollegeFormData {
  collegeName: string;
  email: string;
  walletAddress: string;
  password: string;
  logo: File | null;
}

const defaultForm: CollegeFormData = {
  collegeName: "",
  email: "",
  walletAddress: "",
  password: "",
  logo: null,
};

/* -------------- component -------------- */
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CollegeFormData>(defaultForm);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ----- handlers ----- */
  const handleInputChange = (
    field: keyof CollegeFormData,
    value: string | File | null
  ) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("logo", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else setLogoPreview(null);
  };

  /* ----- sign-up ----- */
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();

    if (!formData.collegeName || !formData.email || !formData.walletAddress || !formData.password) {
      toast.error("Please fill all required fields.");
      return;
    }
    formPayload.append("collegeName", formData.collegeName);
    formPayload.append("email", formData.email);
    formPayload.append("walletAddress", formData.walletAddress);
    formPayload.append("password", formData.password);
    if (formData.logo) formPayload.append("logo", formData.logo);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }

      const data = await res.json();

      localStorage.setItem("collegeData", JSON.stringify(data.college));
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup Error:", err);
      alert(err.message);
    }
  };

  /* ----- sign-in ----- */
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.walletAddress || !formData.password) {
      toast.error("Enter Wallet Address & password");
      return;
    }

    try {
      setLoading(true);
      let college;

      /* Primary: backend login */
      try {
        const { data } = await axios.post(`${BACKEND_URL}/api/login`, {
          walletAddress: formData.walletAddress,
          password: formData.password,
        });
        college = data.college;
      } catch {
        /* Fallback: localStorage demo mode */
        const raw = localStorage.getItem("acadledger_user");
        if (raw) {
          const stored = JSON.parse(raw);
          if (
            stored.walletAddress === formData.walletAddress &&
            formData.password === "demo"
          ) {
            college = stored;
          }
        }
      }

      if (!college) throw new Error("Invalid credentials");

      localStorage.setItem("acadledger_user", JSON.stringify(college));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  /* ----- UI ----- */
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glassmorphic border-slate-700/50 animate-fade-in">
        <CardHeader className="text-center">
          <AnimatedCube />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AcadLedger
          </CardTitle>
          <CardDescription className="text-slate-400">
            Secure certificate minting platform for universities
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            {/* ---------- Tab selectors ---------- */}
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-slate-700"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-slate-700"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* ---------- Sign-in ---------- */}
            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-wallet">Wallet</Label>
                  <Input
                    id="signin-wallet"
                    type="text"
                    placeholder="0xabc123...def"
                    value={formData.walletAddress}
                    onChange={(e) =>
                      handleInputChange("walletAddress", e.target.value)
                    }
                    className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
                  />
                </div>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full gradient-cyan-purple hover-scale"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* ---------- Sign-up ---------- */}
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="college-name">College Name</Label>
                  <Input
                    id="college-name"
                    placeholder="University of Example"
                    value={formData.collegeName}
                    onChange={(e) =>
                      handleInputChange("collegeName", e.target.value)
                    }
                    className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@university.edu"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x742d35Cc6232DCd532d84a012CFB6A"
                    value={formData.walletAddress}
                    onChange={(e) =>
                      handleInputChange("walletAddress", e.target.value)
                    }
                    className="bg-slate-800/50 border-slate-600 focus:border-cyan-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
                  />
                </div>

                {/* logo upload */}
                <div>
                  <Label htmlFor="logo-upload">Logo Upload</Label>
                  <div className="relative">
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="bg-slate-800/50 border-slate-600 focus:border-cyan-500"
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {logoPreview && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img src={logoPreview} alt="Logo preview" className="w-10 h-10 rounded-full border" />
                      <span className="text-slate-300 text-sm truncate max-w-[200px]">{(formData.logo as File)?.name}</span>
                    </div>
                  )}

                </div>

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full gradient-cyan-purple hover-scale"
                >
                  {loading ? "Creating…" : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
