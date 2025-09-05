import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import {
  Upload,
  Sparkles,
  Zap,
  Stars,
  FileText,
  Globe,
  CheckCircle,
} from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ---------- ENV ---------- */
const PINATA_API_KEY = import.meta.env.VITE_APP_PINATA_KEY!;
const PINATA_API_SECRET = import.meta.env.VITE_APP_PINATA_SECRET!;
const CONTRACT_ADDRESS = import.meta.env.VITE_APP_CONTRACT_ADDRESS!;
import CONTRACT_ABI from "@/abi.json"; // adjust path

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL!;

/* ---------- TYPES ---------- */
type Step = "upload" | "generate" | "review" | "mint" | "success";

interface FileData {
  file: File;
  folder: string;
}

interface MetadataItem {
  name: string;
  description: string;
  imageCID: string; // ipfs hash of the image
  metadataCID: string; // ipfs hash of json
  walletAddress: string;
  batch: string;
}

/* ---------- PINATA HELPERS ---------- */
async function pinFileToIPFS(file: File): Promise<string> {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append("file", file);
  const res = await axios.post(url, data, {
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${(data as any)._boundary}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return res.data.IpfsHash as string;
}

async function pinJSONToIPFS(json: any, fileName = "metadata.json"): Promise<string> {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const res = await axios.post(url, json, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return res.data.IpfsHash as string;
}

/* ---------- COMPONENT ---------- */
const CertificateMinting = () => {
  const navigate = useNavigate();

  /* state */
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selected, setSelected] = useState<FileData[]>([]);
  const [metadata, setMetadata] = useState<MetadataItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  /* ---------- STEP 1 – FILES ---------- */
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const list: FileData[] = files.map((f) => {
      const wp = (f as any).webkitRelativePath as string;
      const folder = wp?.split("/")[0] || "Batch-Unknown";
      return { file: f, folder };
    });
    setSelected(list);
  }

  /* ---------- STEP 2 – GENERATE & UPLOAD ---------- */
  async function handleGenerateMetadata() {
    setIsGenerating(true);
    setGenerateProgress(0);

    try {
      const metaArr: MetadataItem[] = [];

      for (let i = 0; i < selected.length; i++) {
        const { file, folder } = selected[i];

        // 🌟 Update progress 0–50%
        setGenerateProgress(Math.floor((i / selected.length) * 50));

        // ✅ Extract file name with correct case using webkitRelativePath
        const relativePath = (file as any).webkitRelativePath || file.name;
        const filename = relativePath.split("/").pop() || "";
        const fileBase = filename.replace(/\.[^/.]+$/, ""); // remove .png/.jpg

        // Extract wallet from filename (e.g., "0xAbc123_Name.png")
        const [maybeWallet, ...rest] = fileBase.split("_");

        // ✅ Normalize and validate wallet with checksummed address
        let wallet: string;
        if (ethers.utils.isAddress(maybeWallet)) {
          wallet = ethers.utils.getAddress(maybeWallet); // preserve checksummed case
        } else {
          console.warn(`Invalid wallet: ${maybeWallet}, generating dummy address.`);
          wallet = "0x" + Math.random().toString(16).substring(2, 42);
        }

        // 📦 Upload image to IPFS
        const imageCID = await pinFileToIPFS(file);

        // 🧾 Construct metadata JSON
        const metaJSON = {
          name: `Certificate - ${rest.join("_") || fileBase}`,
          description: `Soul-Bound Certificate for ${rest.join(" ") || fileBase}`,
          image: `ipfs://${imageCID}`,
          attributes: [
            { trait_type: "Institution", value: "Demo University" },
            { trait_type: "Batch", value: folder },
          ],
        };

        // 📤 Upload metadata JSON to IPFS
        const metadataCID = await pinJSONToIPFS(metaJSON);

        // ✅ Push data to array
        metaArr.push({
          name: metaJSON.name,
          description: metaJSON.description,
          imageCID,
          metadataCID,
          walletAddress: wallet, // preserve checksum-cased address
          batch: folder,
        });

        // 🌟 Update progress 50–100%
        setGenerateProgress(50 + Math.floor(((i + 1) / selected.length) * 50));
      }

      // ✅ Save generated metadata
      setMetadata(metaArr);
      toast.success("Metadata generated & uploaded to IPFS");
      setCurrentStep("review");
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setIsGenerating(false);
      setGenerateProgress(0);
    }
  }


  /* ---------- STEP 4 – MINT ---------- */
/* ---------- STEP 4 – MINT ---------- */
async function handleMint() {
  setIsMinting(true);

  try {
    /* 1️⃣ — MetaMask check + connect */
    if (!(window as any).ethereum) throw new Error("MetaMask not detected");
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer   = provider.getSigner();
    const issuer   = (await signer.getAddress()).toLowerCase();   // ← issuer for DB

    /* 2️⃣ — Sanity-check metadata arrays */
    if (
      !metadata.length ||
      metadata.some(m => !ethers.utils.isAddress(m.walletAddress))
    ) {
      throw new Error("Metadata list empty or contains invalid wallet");
    }
    const wallets = metadata.map(m => m.walletAddress);
    const uris    = metadata.map(m => `ipfs://${m.metadataCID}`);

    if (wallets.length !== uris.length) throw new Error("Array length mismatch");

    /* 3️⃣ — Send mint tx */
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx       = await contract.batchMint(wallets, uris);
    toast.info(`Broadcasting tx ${tx.hash.slice(0, 10)}…`);
    await tx.wait();
    toast.success("Certificates minted 🎉");

    /* 4️⃣ — Log to backend */
    await axios.post(`${BACKEND_URL}/api/logBatch`, {
      issuer,                                         // lower-case college wallet
      batchId          : metadata[0].batch,
      transactionHashes: [tx.hash],
      tokenIds         : metadata.map((_, i) => i),
      tokenURIs        : uris,
      studentWallets   : wallets,
      images           : metadata.map(m =>
                          `https://gateway.pinata.cloud/ipfs/${m.imageCID}`),
      timestamp        : new Date().toISOString(),
    });

    /* 5️⃣ — UI state */
    setCurrentStep("success");
  } catch (err: any) {
    console.error("❌ Mint/log error:", err);
    toast.error(err?.message ?? "Mint failed");
  } finally {
    setIsMinting(false);
  }
}


  /* ---------- UI helpers ---------- */
  const steps = [
    { key: "upload", label: "Upload", icon: Upload },
    { key: "generate", label: "Generate", icon: FileText },
    { key: "review", label: "Review", icon: Globe },
    { key: "mint", label: "Mint", icon: CheckCircle },
    { key: "success", label: "Success", icon: CheckCircle },
  ] as const;

  /* ---------- RENDER STEP CONTENT ---------- */
  const renderStepContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <div className="space-y-6">
            {/* upload header */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Upload className="w-16 h-16 text-cyan-400" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
                <Zap className="w-4 h-4 text-emerald-400 absolute -bottom-1 -left-1 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Certificate Images</h3>
              <p className="text-slate-400">Select a folder containing certificate images</p>
            </div>

            {/* dropzone */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                {...({ webkitdirectory: "true" } as any)}
                directory=""
              // onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="relative">
                    <Upload className="w-12 h-12 mx-auto text-slate-400" />
                    <Stars className="w-4 h-4 text-cyan-400 absolute -top-1 -right-2 animate-spin" />
                  </div>
                  <p className="text-lg font-medium">Choose folder</p>
                  <p className="text-sm text-slate-400">PNG files up to 10 MB each</p>
                </div>
              </label>
            </div>

            {/* selected list */}
            {selected.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Files ({selected.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selected.map(({ file }, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-slate-800/30 rounded">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setCurrentStep("generate")} className="w-full gradient-cyan-purple">
                  Continue to Generate Metadata
                </Button>
              </div>
            )}
          </div>
        );

      /* ---------- GENERATE ---------- */
      case "generate":
        return (
          <div className="space-y-6">
            <div className="text-center">
              {isGenerating ? (
                <>
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="w-full h-full rounded-full border-4 border-slate-600"></div>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-cyan-500 animate-spin"
                      style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Generating Metadata</h3>
                  <p className="text-slate-400">Uploading & processing files…</p>
                </>
              ) : (
                <>
                  <FileText className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Generate Metadata</h3>
                  <p className="text-slate-400">Process {selected.length} certificate images</p>
                </>
              )}
            </div>

            {isGenerating && (
              <div className="space-y-4">
                <Progress value={generateProgress} />
                <p className="text-center text-xs text-slate-400">{generateProgress}% complete</p>
              </div>
            )}

            {!isGenerating && (
              <Button onClick={handleGenerateMetadata} className="w-full gradient-cyan-purple">
                Generate Metadata
              </Button>
            )}
          </div>
        );

      /* ---------- REVIEW ---------- */
      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Metadata</h3>
              <p className="text-slate-400">Verify certificate metadata</p>
            </div>

            {/* simple list */}
            <div className="max-h-52 overflow-y-auto divide-y border rounded-md">
              {metadata.map((m, i) => (
                <div key={i} className="p-3 flex flex-col">
                  <span className="font-medium text-sm">{m.name}</span>
                  <span className="text-xs text-slate-400">{m.walletAddress}</span>
                  <Badge className="w-max mt-1">{m.batch}</Badge>
                </div>
              ))}
            </div>

            <Card className="glassmorphic border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-sm">Batch JSON Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-slate-800/50 p-3 rounded overflow-auto max-h-48 font-mono">
                  {JSON.stringify(
                    metadata.map((m) => ({
                      wallet: m.walletAddress,
                      image: `ipfs://${m.imageCID}`,
                      tokenURI: `ipfs://${m.metadataCID}`,
                      batch: m.batch,
                    })),
                    null,
                    2
                  )}
                </pre>
              </CardContent>
            </Card>

            <Button onClick={() => setCurrentStep("mint")} className="w-full gradient-cyan-purple">
              Continue to Mint
            </Button>
          </div>
        );

      /* ---------- MINT ---------- */
      case "mint":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Mint</h3>
              <p className="text-slate-400">Mint {metadata.length} certificates on Sepolia</p>
            </div>

            <Progress value={isMinting ? undefined : 0} />

            <Button
              disabled={isMinting}
              onClick={handleMint}
              className="w-full gradient-emerald hover-scale"
            >
              {isMinting ? "Minting…" : "Mint Certificates"}
            </Button>
          </div>
        );

      /* ---------- SUCCESS ---------- */
      case "success":
        return (
          <div className="space-y-6 text-center">
            <CheckCircle className="w-24 h-24 mx-auto text-emerald-400 animate-pulse mb-4" />
            <h3 className="text-2xl font-bold text-emerald-400">Minted Successfully!</h3>
            <p className="text-slate-400">
              {metadata.length} certificates minted & distributed.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/dashboard")} className="flex-1 gradient-cyan-purple">
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep("upload");
                  setSelected([]);
                  setMetadata([]);
                }}
                className="flex-1 border-slate-600"
              >
                Mint More
              </Button>
            </div>
          </div>
        );
    }
  };

  /* ---------- MAIN ---------- */
  //   return (
  //     <div className="min-h-screen p-6">
  //       <div className="max-w-4xl mx-auto">
  //         <header className="mb-8">
  //           <h1 className="text-3xl font-bold mb-1">Certificate Minting Wizard</h1>
  //           <p className="text-slate-400">Create & mint soul-bound certificate NFTs</p>
  //         </header>

  //         {/* progress bubbles */}
  //         <div className="mb-8 flex items-center justify-between">
  //           {steps.map((s, i) => {
  //             const active = s.key === currentStep;
  //             const complete = steps.findIndex((st) => st.key === currentStep) > i;
  //             const Icon = s.icon;
  //             return (
  //               <React.Fragment key={s.key}>
  //                 <div className="flex flex-col items-center">
  //                   <div
  //                     className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${
  //                       active
  //                         ? "bg-cyan-500 border-cyan-500 text-white"
  //                         : complete
  //                         ? "bg-emerald-500 border-emerald-500 text-white"
  //                         : "border-slate-600 text-slate-400"
  //                     }`}
  //                   >
  //                     <Icon className="w-4 h-4" />
  //                   </div>
  //                   <span
  //                     className={`text-xs mt-1 ${
  //                       active ? "text-cyan-400" : complete ? "text-emerald-400" : "text-slate-400"
  //                     }`}
  //                   >
  //                     {s.label}
  //                   </span>
  //                 </div>
  //                 {i < steps.length - 1 && (
  //                   <div className={`flex-1 h-0.5 mx-2 ${complete ? "bg-emerald-500" : "bg-slate-600"}`} />
  //                 )}
  //               </React.Fragment>
  //             );
  //           })}
  //         </div>

  //         <Card className="glassmorphic border-slate-700/50">
  //           <CardContent className="p-8">{renderStepContent()}</CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // };

  // export default CertificateMinting;

  return (
    <div className="min-h-screen p-6 relative">
      <div className="absolute top-6 right-6 z-10">
        <Button onClick={() => navigate("/dashboard")} className="gradient-cyan-purple">
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Certificate Minting Wizard</h1>
          <p className="text-slate-400">Create & mint soul-bound certificate NFTs</p>
        </header>

        {/* progress bubbles */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((s, i) => {
            const active = s.key === currentStep;
            const complete = steps.findIndex((st) => st.key === currentStep) > i;
            const Icon = s.icon;
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${active
                      ? "bg-cyan-500 border-cyan-500 text-white"
                      : complete
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-600 text-slate-400"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs mt-1 ${active ? "text-cyan-400" : complete ? "text-emerald-400" : "text-slate-400"
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${complete ? "bg-emerald-500" : "bg-slate-600"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <Card className="glassmorphic border-slate-700/50">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateMinting;