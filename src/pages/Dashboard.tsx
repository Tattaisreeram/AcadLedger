
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Plus,
  LogOut,
  ExternalLink,
  Wallet as WalletIcon,
} from "lucide-react";

const BACKEND = import.meta.env.VITE_APP_BACKEND_URL!;

/* ---- shape returned by GET /api/batches (after your backend change) ---- */
interface LedgerRow {
  wallet: string;
  tokenId: number;
  tokenURI: string;
  txHash: string;
  image?: string;
}

/* ---- UI shape ---- */
interface UiBatch {
  id: string;             // txHash is unique per mint
  txHash: string;
  studentCount: number;
  transactions: {
    walletAddress: string;
    tokenId: number;
    tokenURI: string;
    image: string;
  }[];
}

/* ---- user from localStorage ---- */
interface LocalUser {
  collegeName: string;
  email: string;
  walletAddress: string;
  logoUrl?: string;
}

const Dashboard = () => {
  const nav = useNavigate();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [batches, setBatches] = useState<UiBatch[]>([]);
  const [loading, setLoading] = useState(false);

  /* 1️⃣ read the logged-in college once */
  useEffect(() => {
    const raw = localStorage.getItem("acadledger_user");
    if (!raw) {
      nav("/"); // not logged in
      return;
    }
    const stored = JSON.parse(raw);
    if (stored.logoUrl && !stored.logoUrl.startsWith("http")) {
      stored.logoUrl = `${BACKEND}/uploads/${stored.logoUrl}`;
    }
    setUser(stored);
  }, [nav]);

  /* 2️⃣ fetch ledger rows once the wallet is known */
  useEffect(() => {
    if (!user?.walletAddress) return;

    (async () => {
      try {
        setLoading(true);

        const { data } = await axios.get<LedgerRow[]>(
          `${BACKEND}/api/batches`,
          { params: { issuer: user.walletAddress.toLowerCase() } }
        );

        console.log("🧾 ledger rows", data);

        /* ---- group rows by txHash (one mint = one batch) ---- */
        const grouped: Record<string, LedgerRow[]> = {};
        data.forEach((row) => {
          if (!grouped[row.txHash]) grouped[row.txHash] = [];
          grouped[row.txHash].push(row);
        });

        const ui: UiBatch[] = Object.entries(grouped).map(
          ([txHash, rows]) => ({
            id: txHash,
            txHash,
            studentCount: rows.length,
            transactions: rows.map((r) => ({
              walletAddress: r.wallet,
              tokenId: r.tokenId,
              tokenURI: r.tokenURI,
              image: r.image || "",
            })),
          })
        );

        /* newest first: Mongo _id increases with time so reverse by default */
        ui.sort((a, b) => (a.txHash < b.txHash ? 1 : -1));

        setBatches(ui);
      } catch (err: any) {
        console.error("Ledger fetch failed", err);
        toast.error(
          err?.response?.data?.message || "Failed to load ledger"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  /* helpers */
  const handleSendCertificates = () => nav("/mint");
  const handleLogout = () => {
    localStorage.removeItem("acadledger_user");
    toast.success("Logged out");
    nav("/");
  };
  const handleViewOnEtherscan = (hash: string) =>
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank");

  if (!user) return null;

  /* ------------ JSX ------------ */
  return (
    <div className="min-h-screen p-6">
      {/* header */}
      <div className="glassmorphic rounded-lg p-6 mb-6 border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              {user.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt="College logo"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.textContent =
                      user.collegeName?.charAt(0) ?? "?";
                  }}
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {user.collegeName?.charAt(0) ?? "?"}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-xl font-semibold text-white">
                {user.collegeName}
              </h1>
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleSendCertificates}
              className="gradient-emerald hover-scale"
            >
              <Plus className="w-4 h-4 mr-2" />
              Send Certificates
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* college info */}
      <Card className="glassmorphic border-slate-700/50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <WalletIcon className="w-5 h-5 mr-2 text-cyan-400" />
            College Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Wallet Address</p>
            <p className="font-mono text-sm text-white bg-slate-800/50 p-2 rounded border">
              {user.walletAddress}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Batches</p>
            <p className="text-2xl font-bold text-cyan-400">
              {batches.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* batches */}
      <Card className="glassmorphic border-slate-700/50">
        <CardHeader>
          <CardTitle>Certificate Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 py-12 text-center">Loading…</p>
          ) : batches.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-4 bg-slate-800/30 rounded-lg blur-sm" />
              <p className="text-slate-400">No certificate batches yet</p>
              <Button
                onClick={handleSendCertificates}
                className="mt-4 gradient-cyan-purple hover-scale"
              >
                Create Your First Batch
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {batches.map((batch) => (
                <AccordionItem
                  key={batch.id}
                  value={batch.id}
                  className="glassmorphic rounded-lg border-slate-700/50"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-medium text-white">
                          Tx&nbsp;
                          {batch.txHash.slice(0, 6)}…
                          {batch.txHash.slice(-4)}
                        </h3>
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          {batch.studentCount} students
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-2">
                      {batch.transactions.map((tx, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <span className="font-mono text-xs text-slate-400">
                              {tx.walletAddress}
                            </span>
                            <span className="font-mono text-xs text-slate-500">
                              #{tx.tokenId}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOnEtherscan(batch.txHash)}
                            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Tx
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
