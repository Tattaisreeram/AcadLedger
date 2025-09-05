import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import abi from "./sbtAbi.js";
import Transaction from "./Transaction.js";
import College from "./college.js";

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
const iface = new ethers.Interface(abi);

export const mintBatch = async (req, res) => {
  try {
    const metadataArr = req.body;
    if (!Array.isArray(metadataArr) || metadataArr.length === 0) {
      return res.status(400).json({ message: "Body must be an array" });
    }

    const recipients = metadataArr.map(i => i.wallet);
    const tokenURIs = metadataArr.map(i => i.metadataUri);
    const images = metadataArr.map(i => i.image);
    const { batch, year } = metadataArr[0];
    if (!batch || !year) {
      return res.status(400).json({ message: "Missing batch or year in metadata" });
    }
    if (metadataArr.some(i => !i.wallet || !i.metadataUri)) {
      return res.status(400).json({ message: "Invalid metadata: wallet or metadataUri missing" });
    }
    const tx = await contract.batchMint(recipients, tokenURIs);
    console.log("🟢 Mint tx sent:", tx.hash);
    const receipt = await tx.wait(1);
    console.log("✅ Tx mined:", receipt.transactionHash);
    const txHashes = Array(recipients.length).fill(tx.hash);

    const mintedTokenIds = [];
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed.name === "BatchCertificateMinted") {
          mintedTokenIds.push(...parsed.args.tokenIds.map(id => Number(id)));
        }
      } catch {/* skip */ }
    }

    if (
      mintedTokenIds.length !== recipients.length ||
      tokenURIs.length !== recipients.length ||
      images.length !== recipients.length
    ) {
      console.error("❌ Array length mismatch after mint");
      return res.status(500).json({ message: "Length mismatch" });
    }
    console.log("📦 Saving to DB:", {
      collegeAddress: req.body.issuer.toLowerCase(),
      transactionHashes: Array(recipients.length).fill(tx.hash),
      tokenIds: mintedTokenIds,
      studentWallets: recipients,
    });

    await Transaction.create({
      collegeAddress: req.body.issuer.toLowerCase(),
      transactionHashes: [tx.hash],
      tokenIds: mintedTokenIds,
      tokenURIs,
      studentWallets: recipients,
      images,
    });

    res.status(201).json({
      message: "🎉 Minted and logged",
      txHash: tx.hash,
      tokenIds: mintedTokenIds,
    });

  } catch (err) {
    console.error("❌ Mint error:", err);
    res.status(500).json({ error: err.message || "Mint failed" });
  }
};

export const logTransaction = async (req, res) => {
  console.log("🔵 Incoming /logBatch payload:", req.body);

  const {
    issuer,
    transactionHashes,
    tokenIds,
    tokenURIs,
    studentWallets,
    images,
  } = req.body;

  if (!issuer ||
    !Array.isArray(transactionHashes) ||
    !Array.isArray(tokenIds) ||
    !Array.isArray(tokenURIs) ||
    !Array.isArray(studentWallets) ||
    transactionHashes.length === 0 ||
    tokenIds.length === 0 ||
    tokenURIs.length === 0 ||
    studentWallets.length === 0 ||
    tokenIds.length !== tokenURIs.length ||
    tokenIds.length !== studentWallets.length) {
    return res
      .status(400)
      .json({ error: "Bad /logBatch payload – check batchId, arrays & lengths" });
  }

  try {
    if (
      !Array.isArray(transactionHashes) ||
      !Array.isArray(tokenIds) ||
      !Array.isArray(studentWallets) ||
      !Array.isArray(tokenURIs) ||
      !Array.isArray(images)
    ) {
      console.log("❌ Invalid payload:", req.body);
      return res.status(400).json({ message: "Bad /logBatch payload" });
    }
const imagesSafe = Array.isArray(images) ? images : Array(studentWallets.length).fill("");

    await Transaction.create({
      collegeAddress: issuer,
      transactionHashes,
      tokenIds,
      tokenURIs,
      studentWallets,
      images:imagesSafe,
    });

    res.status(201).json({
      message: "Transaction logged",
      txHashes: transactionHashes,
      tokenIds,
      studentWallets,
      tokenURIs,
    });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getLedger = async (req, res) => {
  try {
    const issuerRaw = req.query.issuer;
    const issuer = issuerRaw?.toLowerCase();

    console.log("📥 Incoming request for ledger. Issuer:", issuer);

    const query = issuer ? { collegeAddress: issuer.toLowerCase() } : {};
const all = await Transaction.find(query).sort({ _id: -1 }).lean();

    console.log("Raw transactions count:", all.length);
    all.forEach(tx => {
      console.log("studentWallets length:", tx.studentWallets.length);
      console.log("tokenIds length:", tx.tokenIds.length);
      console.log("tokenURIs length:", tx.tokenURIs?.length || 0);
      console.log("transactionHashes length:", tx.transactionHashes?.length || 0);
      console.log("images length:", tx.images?.length || 0);
    });
    const expanded = all.flatMap(tx =>
      (tx.studentWallets || []).map((wallet, i) => ({
        wallet: wallet || "",
        tokenId: tx.tokenIds?.[i],
        tokenURI: tx.tokenURIs?.[i] || "",
        image:(tx.images && tx.images[i])  || "",
        txHash: tx.transactionHashes?.[0] || "",
      }))
    );

    const valid = expanded.filter(entry => {
      if (!entry.wallet) console.log("Missing wallet", entry);
      if (entry.tokenId === undefined) console.log("Missing tokenId", entry);
      if (!entry.tokenURI) console.log("Missing tokenURI", entry);
      if (!entry.txHash) console.log("Missing txHash", entry);
      return entry.wallet && entry.tokenId !== undefined &&  entry.tokenURI && entry.txHash ;
    });
    if (valid.length === 0) {
      console.log("No valid transactions for this issuer – returning empty list");
      return res.status(200).json([]);
    }
    console.log(`✅ Found ${valid.length} valid transactions for issuer ${issuer}`);
    res.status(200).json(valid);

  } catch (err) {
    console.error("💥 getLedger error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const signupCollege = async (req, res) => {
  try {
    const { collegeName, email, walletAddress, password } = req.body;
    const logoFile = req.file?.filename;
    console.log("📦 Uploaded file:", req.file);


    const existing = await College.findOne({ walletAddress });
    if (existing) return res.status(400).json({ message: "Wallet already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const logoUrl = logoFile ? `${req.protocol}://${req.get("host")}/uploads/${logoFile}` : "";

    const newCollege = await College.create({
      collegeName,
      email,
      walletAddress,
      password: hashedPassword,
      logo: logoFile,
    });

    const token = jwt.sign({ id: newCollege._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.status(201).json({
      message: "Signup successful",
      college: {
        id: newCollege._id,
        collegeName: newCollege.collegeName,
        email: newCollege.email,
        walletAddress: newCollege.walletAddress,
        logoUrl, // Full URL returned
      },
      token,
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const signinCollege = async (req, res) => {
  try {
    const { walletAddress, password } = req.body;
    const college = await College.findOne({ walletAddress });

    if (!college) return res.status(404).json({ message: "Wallet not registered" });

    const isMatch = await bcrypt.compare(password, college.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: college._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    const logoUrl = college.logo
      ? `${req.protocol}://${req.get("host")}/uploads/${college.logo}`
      : "";

    res.status(200).json({
      message: "Login successful",
      college: {
        id: college._id,
        collegeName: college.collegeName,
        email: college.email,
        walletAddress: college.walletAddress,
        logoUrl, // Full logo URL returned
      },
      token,
    });
  } catch (err) {
    console.error("❌ Signin error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getCollegeProfile = async (req, res) => {
  try {
    const college = await College.findById(req.userId); // or however you get user ID

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const logoUrl = college.logo
      ? `${req.protocol}://${req.get("host")}/uploads/${college.logo}`
      : "";

    res.json({
      id: college._id,
      collegeName: college.collegeName,
      email: college.email,
      walletAddress: college.walletAddress,
      logoUrl, // send full URL here
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
