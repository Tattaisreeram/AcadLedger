import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logo: {type:String},
}, { timestamps: true });


const College = mongoose.model("College", collegeSchema);
export default College;