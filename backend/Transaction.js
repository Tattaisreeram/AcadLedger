import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  collegeAddress: String,
  transactionHashes: [String],
  tokenIds: [Number],
  tokenURIs: [String],
  studentWallets: [String],
images: {
  type: [String],
  default: [],
}});

export default mongoose.model("Transaction", transactionSchema);