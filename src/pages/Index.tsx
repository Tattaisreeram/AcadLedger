
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// const Index = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const navigate = useNavigate();

//   const handleSignIn = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Simulate authentication
//     if (credentials.username && credentials.password) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

//       <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/20 backdrop-blur-xl shadow-2xl">
//         <CardHeader className="text-center space-y-4">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
//             <div className="w-8 h-8 bg-white rounded-lg"></div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-white">College Portal</CardTitle>
//           <CardDescription className="text-purple-200">
//             Sign in with your college credentials to access the Web3 certification dashboard
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSignIn} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username" className="text-purple-200">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Enter your username"
//                 value={credentials.username}
//                 onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//                 className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-purple-200">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={credentials.password}
//                 onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//                 className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
//                 required
//               />
//             </div>

//             <Button 
//               type="submit" 
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
//             >
//               Sign In to Dashboard
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Index;


// import { Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SignupSignin from "./SignupSignin";
// import Dashboard from "./Dashboard";
// import MintCertificates from "./MintCertificates";

// const Index = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [collegeData, setCollegeData] = useState(null);

//   useEffect(() => {
//     // Check if user is logged in
//     const storedData = localStorage.getItem('collegeData');
//     if (storedData) {
//       setCollegeData(JSON.parse(storedData));
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleLogin = (data: any) => {
//     setCollegeData(data);
//     setIsAuthenticated(true);
//     localStorage.setItem('collegeData', JSON.stringify(data));
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setCollegeData(null);
//     localStorage.removeItem('collegeData');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <Routes>
//         <Route 
//           path="/auth" 
//           element={
//             !isAuthenticated ? (
//               <SignupSignin onLogin={handleLogin} />
//             ) : (
//               <Navigate to="/dashboard" replace />
//             )
//           } 
//         />
//         <Route 
//           path="/dashboard" 
//           element={
//             isAuthenticated ? (
//               <Dashboard collegeData={collegeData} onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/auth" replace />
//             )
//           } 
//         />
//         <Route 
//           path="/mint" 
//           element={
//             isAuthenticated ? (
//               <MintCertificates collegeData={collegeData} />
//             ) : (
//               <Navigate to="/auth" replace />
//             )
//           } 
//         />
//         <Route path="/" element={<Navigate to="/auth" replace />} />
//       </Routes>
//     </div>
//   );
// };

// export default Index;

// src/pages/Index.tsx      ← the router

// import { Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// import SignupSignin     from "./SignupSignin";
// import Dashboard        from "./Dashboard";
// import MintCertificates from "./MintCertificates";   // old single-screen uploader (keep)
// import MintPortal       from "./MintPortal";         // 🆕 5-step wizard

// const Index = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [collegeData,     setCollegeData]     = useState<any>(null);

//   /* ---- sticky login via localStorage ---- */
//   useEffect(() => {
//     const stored = localStorage.getItem("collegeData");
//     if (stored) {
//       setCollegeData(JSON.parse(stored));
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleLogin = (data: any) => {
//     setCollegeData(data);
//     setIsAuthenticated(true);
//     localStorage.setItem("collegeData", JSON.stringify(data));
//   };

//   const handleLogout = () => {
//     setCollegeData(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem("collegeData");
//   };

//   return (
//     <Routes>
//       {/* -------------- AUTH -------------- */}
//       <Route
//         path="/auth"
//         element={
//           !isAuthenticated ? (
//             <SignupSignin onLogin={handleLogin} />
//           ) : (
//             <Navigate to="/dashboard" replace />
//           )
//         }
//       />

//       {/* -------------- DASHBOARD -------------- */}
//       <Route
//         path="/dashboard"
//         element={
//           isAuthenticated ? (
//             <Dashboard collegeData={collegeData} onLogout={handleLogout} />
//           ) : (
//             <Navigate to="/auth" replace />
//           )
//         }
//       />

//       {/* -------------- OLD SINGLE-PAGE MINT -------------- */}
//       <Route
//         path="/mint-simple"
//         element={
//           isAuthenticated ? (
//             <MintCertificates collegeData={collegeData} />
//           ) : (
//             <Navigate to="/auth" replace />
//           )
//         }
//       />

//       {/* -------------- NEW 5-STEP WIZARD -------------- */}
//       <Route
//         path="/mint"
//         element={
//           isAuthenticated ? (
//             <MintPortal collegeData={collegeData} />
//           ) : (
//             <Navigate to="/auth" replace />
//           )
//         }
//       />

//       {/* -------------- DEFAULT & 404 -------------- */}
//       <Route path="/"        element={<Navigate to="/auth" replace />} />
//       <Route path="*"        element={<Navigate to="/auth" replace />} />
//     </Routes>
//   );
// };

// export default Index;




// import React, { useState } from 'react';
// import axios from 'axios';
// import { ethers } from 'ethers';

// import { FileUpload } from '@/components/FileUploadStep';
// import { MetadataGenerator } from '@/components/MetadataGenerationStep';
// import { JsonViewer } from '@/components/JsonViewer';
// import { MintButton } from '@/components/MintingStep';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// import contractAbi from '../abi.json'; // adjust the path as needed

// type Step = 'upload' | 'metadata' | 'json' | 'mint' | 'success';

// const PINATA_API_KEY = import.meta.env.VITE_APP_PINATA_KEY!;
// const PINATA_API_SECRET = import.meta.env.VITE_APP_PINATA_SECRET!;
// const CONTRACT_ADDRESS = import.meta.env.VITE_APP_CONTRACT_ADDRESS!;
// const CONTRACT_ABI = contractAbi;
// const BACKEND_URL=import.meta.env.VITE_APP_BACKEND_URL!;
// const Index = () => {
//   const [currentStep, setCurrentStep] = useState<Step>('upload');
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [metadata, setMetadata] = useState<any[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isMinting, setIsMinting] = useState(false);
//   const [status, setStatus] = useState<string>('');

//   // Upload a single file to Pinata and return the IPFS gateway URL
//   async function uploadImageToPinata(file: File): Promise<string> {
//     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await axios.post(url, formData, {
//       maxBodyLength: Infinity,
//       headers: {
//         "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
//         pinata_api_key: PINATA_API_KEY,
//         pinata_secret_api_key: PINATA_API_SECRET,
//       },
//     });

//     return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
//   }

//   // Handle file upload step - just save files and move to metadata step
//   const handleFilesUploaded = (files: File[]) => {
//     setUploadedFiles(files);
//     setCurrentStep('metadata');
//   };

//   // Generate metadata for each uploaded file by uploading images and creating JSON metadata on IPFS
//   const handleMetadataGenerated = async () => {
//     setIsGenerating(true);
//     setStatus('Uploading images and generating metadata on IPFS...');

//     try {
//       // Upload images to Pinata and generate metadata array
//       const generatedMetadata = [];

//       for (const file of uploadedFiles) {
//         // Extract wallet from filename (assumes filename like '0xabc123.png')
//         const wallet = file.name.split('.')[0];
//         if (!ethers.utils.isAddress(wallet)) {
//           console.warn(`Invalid wallet address: ${wallet}, skipping file.`);
//           continue;
//         }

//         // Upload image to IPFS
//         const ipfsImageLink = await uploadImageToPinata(file);

//         // Create metadata JSON
//         const meta = {
//           name: `Certificate for ${wallet}`,
//           description: 'Certificate NFT minted via portal',
//           image: ipfsImageLink,
//           wallet,
//           timestamp: new Date().toISOString(),
//         };

//         // Upload metadata JSON to Pinata as JSON string file
//         const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', meta, {
//           headers: {
//             pinata_api_key: PINATA_API_KEY,
//             pinata_secret_api_key: PINATA_API_SECRET,
//           },
//         });

//         const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;

//         generatedMetadata.push({
//           wallet,
//           tokenURI,
//           meta,
//         });
//       }

//       setMetadata(generatedMetadata);
//       setStatus('');
//       setIsGenerating(false);
//       setCurrentStep('json');

//     } catch (error) {
//       console.error('Error generating metadata:', error);
//       setStatus('Error during metadata generation. Check console.');
//       setIsGenerating(false);
//     }
//   };

//   // Mint certificates on blockchain using ethers.js
//   const handleMintStart = async () => {
//     if (!window.ethereum) {
//       setStatus('No Ethereum provider found. Please install MetaMask.');
//       return;
//     }

//     setIsMinting(true);
//     setStatus('Connecting to blockchain and minting...');

//     try {
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

//       for (const item of metadata) {
//         const tx = await contract.batchMint(item.wallet, item.tokenURI);
//         setStatus(`Minting certificate for ${item.wallet}... TxHash: ${tx.hash}`);
//         await tx.wait();
//         await axios.post(`${BACKEND_URL}/logTransaction`, {
//           txHash: tx.hash,
//           from: await signer.getAddress(),
//           to: item.wallet,
//           tokenURI: item.tokenURI,
//           timestamp: new Date().toISOString(),
//         });
//       }

//       setIsMinting(false);
//       setStatus('');
//       setCurrentStep('success');
//     } catch (error) {
//       console.error('Minting error:', error);
//       setStatus('Error during minting. Check console.');
//       setIsMinting(false);
//     }
//   };

//   const resetForm = () => {
//     setCurrentStep('upload');
//     setUploadedFiles([]);
//     setMetadata([]);
//     setIsGenerating(false);
//     setIsMinting(false);
//     setStatus('');
//   };

//   const getStepNumber = (step: Step): number => {
//     const steps = ['upload', 'metadata', 'json', 'mint', 'success'];
//     return steps.indexOf(step) + 1;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
//       </div>

//       {/* Grid Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="w-full h-full" style={{
//           backgroundImage: `
//             linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
//           `,
//           backgroundSize: '50px 50px'
//         }}></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12 animate-fade-in">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 hover:scale-110 transition-transform duration-300">
//             <div className="w-8 h-8 border-2 border-white rounded border-dashed animate-spin"></div>
//           </div>
//           <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//             Certificate Minting Portal
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Upload your certificates, generate metadata on IPFS, and mint them as NFTs on the blockchain
//           </p>
//         </div>

//         {/* Progress Steps */}
//         <div className="flex justify-center mb-12">
//           <div className="flex items-center space-x-4">
//             {(['upload', 'metadata', 'json', 'mint', 'success'] as Step[]).map((step, index) => {
//               const stepNumber = index + 1;
//               const isActive = getStepNumber(currentStep) >= stepNumber;
//               const isCurrent = currentStep === step;

//               return (
//                 <div key={step} className="flex items-center">
//                   <div className={`
//                     relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
//                     transition-all duration-500 hover:scale-110
//                     ${isActive
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
//                       : 'bg-gray-700 text-gray-400'
//                     }
//                     ${isCurrent ? 'ring-4 ring-blue-400 ring-opacity-50 animate-pulse' : ''}
//                   `}>
//                     <span>{stepNumber}</span>
//                   </div>
//                   {index < 4 && (
//                     <div className={`w-20 h-1 rounded-full
//                       ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'}
//                       transition-colors duration-500
//                     `}></div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <Card className="p-8 max-w-4xl mx-auto bg-slate-900 bg-opacity-80 shadow-lg rounded-lg">
//           {currentStep === 'upload' && (
//             <FileUpload onFilesUploaded={handleFilesUploaded} />
//           )}

//           {currentStep === 'metadata' && (
//             <>
//               <MetadataGenerator
//                 uploadedFiles={uploadedFiles}
//                 onGenerateMetadata={handleMetadataGenerated}
//                 isGenerating={isGenerating}
//                 status={setStatus}
//               />
//               <div className="mt-6 flex justify-between">
//                 <button
//                   onClick={() => setCurrentStep('upload')}
//                   className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                   disabled={isGenerating}
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={handleMetadataGenerated}
//                   className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
//                   disabled={isGenerating}
//                 >
//                   Generate Metadata
//                 </button>
//               </div>
//             </>
//           )}

//           {currentStep === 'json' && (
//             <>
//               <JsonViewer metadata={metadata} onContinue={() => setCurrentStep('metadata')} />
//               <div className="mt-6 flex justify-between">
//                 <button
//                   onClick={() => setCurrentStep('metadata')}
//                   className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                   disabled={isGenerating}
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={() => setCurrentStep('mint')}
//                   className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
//                   disabled={metadata.length === 0}
//                 >
//                   Proceed to Mint
//                 </button>
//               </div>
//             </>
//           )}

//           {currentStep === 'mint' && (
//             <>
//               <MintButton
//                 metadata={metadata}
//                 onMintStart={handleMintStart}
//                 isMinting={isMinting}
//               />

//               <div className="mt-6 flex justify-between">
//                 <button
//                   onClick={() => setCurrentStep('json')}
//                   className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                   disabled={isMinting}
//                 >
//                   Back
//                 </button>
//               </div>
//             </>
//           )}

//           {currentStep === 'success' && (
//             <div className="text-center">
//               <Badge variant="outline" className="mb-6 px-8 py-4 text-lg">
//                 🎉 Certificates minted successfully!
//               </Badge>
//               <button
//                 onClick={resetForm}
//                 className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 Mint More
//               </button>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Index;

// src/pages/Index.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import AuthPage            from "./AuthPage";
import Dashboard           from "./Dashboard";
import CertificateMinting  from "./CertificateMinting";
import NotFound            from "./NotFound";

interface User {
  collegeName: string;
  email: string;
  walletAddress: string;
  logoUrl?: string;
}

/* 🔒 Helper component — guards private routes */
const PrivateRoute = ({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: JSX.Element;
}) => {
  const location = useLocation();
  if (!isAuthed)
    return <Navigate to="/auth" replace state={{ from: location }} />;
  return children;
};

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  /* ⏪ read auth data once on load */
  useEffect(() => {
    const stored = localStorage.getItem("acadledger_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  /* callbacks passed down to AuthPage */
  const handleLogin = (userObj: User) => {
    localStorage.setItem("acadledger_user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const handleLogout = () => {
    localStorage.removeItem("acadledger_user");
    setUser(null);
  };

  return (
    <Routes>
      {/* AUTH / SIGN-UP */}
      <Route
        path="/auth"
        element={
          user ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={handleLogin} />
        }
      />

      {/* DASHBOARD (protected) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute isAuthed={!!user}>
            <Dashboard onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* CERTIFICATE MINTING (protected) */}
      <Route
        path="/mint"
        element={
          <PrivateRoute isAuthed={!!user}>
            <CertificateMinting />
          </PrivateRoute>
        }
      />

      {/* Root → go to auth */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
