import express from "express";
import { logTransaction, mintBatch, getLedger } from "./controllers.js";
import Transaction from "./Transaction.js";

const router = express.Router();

router.get("/batches", getLedger);
router.post("/logBatch", logTransaction); // manual log test
router.post("/mint", mintBatch);     // real mint+log
router.get("/logBatch", (req, res) => {
    res.send("logBatch is alive but expects POST");
});

export default router;