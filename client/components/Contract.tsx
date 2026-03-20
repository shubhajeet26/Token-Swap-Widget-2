"use client";

import { useState, useCallback, useEffect } from "react";
import {
  createSwap,
  acceptSwap,
  cancelSwap,
  getActiveSwaps,
  CONTRACT_ADDRESS,
  SwapOffer,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M21 3 9 15" />
      <path d="M3 21l12-12" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Swap Card ────────────────────────────────────────────────

function SwapCard({
  swap,
  walletAddress,
  onAccept,
  onCancel,
  isProcessing,
}: {
  swap: SwapOffer & { id: number };
  walletAddress: string | null;
  onAccept: (id: number) => void;
  onCancel: (id: number) => void;
  isProcessing: boolean;
}) {
  const isCreator = walletAddress && swap.creator === walletAddress;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all hover:border-white/[0.1]">
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
        <span className="text-[10px] font-mono text-white/20">Swap #{swap.id}</span>
        <Badge variant={swap.active ? "success" : "warning"}>
          <span className={cn("h-1.5 w-1.5 rounded-full", swap.active ? "bg-[#34d399]" : "bg-[#fbbf24]")} />
          {swap.active ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        {/* Offer side */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">You give</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-white/80 font-medium">
              {Number(swap.offer_amount).toLocaleString()}
            </span>
            <span className="text-[10px] text-white/25 font-mono" title={swap.offer_token}>
              {swap.offer_token.slice(0, 6)}...{swap.offer_token.slice(-4)}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 text-white/20">
            <ArrowRightIcon />
            <ArrowRightIcon />
          </div>
        </div>

        {/* Request side */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">You get</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-white/80 font-medium">
              {Number(swap.request_amount).toLocaleString()}
            </span>
            <span className="text-[10px] text-white/25 font-mono" title={swap.request_token}>
              {swap.request_token.slice(0, 6)}...{swap.request_token.slice(-4)}
            </span>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-white/25">Creator</span>
          <span className="text-[10px] font-mono text-white/30">
            {swap.creator.slice(0, 6)}...{swap.creator.slice(-4)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {swap.active && (
        <div className="px-4 pb-4">
          {isCreator ? (
            <button
              onClick={() => onCancel(swap.id)}
              disabled={isProcessing}
              className="w-full rounded-lg border border-[#f87171]/20 bg-[#f87171]/[0.05] py-2.5 text-xs font-medium text-[#f87171]/70 hover:border-[#f87171]/40 hover:text-[#f87171]/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isProcessing ? <SpinnerIcon /> : <XIcon />}
              Cancel Swap
            </button>
          ) : (
            <button
              onClick={() => onAccept(swap.id)}
              disabled={isProcessing || !walletAddress}
              className="w-full rounded-lg bg-gradient-to-r from-[#7c6cf0] to-[#4fc3f7] py-2.5 text-xs font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isProcessing ? <SpinnerIcon /> : <CheckIcon />}
              Accept Swap
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

type Tab = "create" | "browse" | "my";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Create swap state
  const [offerToken, setOfferToken] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [requestToken, setRequestToken] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdSwapId, setCreatedSwapId] = useState<number | null>(null);

  // Browse state
  const [swaps, setSwaps] = useState<(SwapOffer & { id: number })[]>([]);
  const [isLoadingSwaps, setIsLoadingSwaps] = useState(false);
  const [processingSwapId, setProcessingSwapId] = useState<number | null>(null);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const loadActiveSwaps = useCallback(async () => {
    setIsLoadingSwaps(true);
    try {
      const result = await getActiveSwaps(walletAddress || undefined);
      if (result && Array.isArray(result)) {
        const mapped = result.map((s: SwapOffer, i: number) => ({
          ...s,
          id: i,
        })).filter((s: SwapOffer & { id: number }) => s.active);
        setSwaps(mapped);
      }
    } catch {
      // silently fail on load
    } finally {
      setIsLoadingSwaps(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (activeTab === "browse" || activeTab === "my") {
      loadActiveSwaps();
    }
  }, [activeTab, loadActiveSwaps]);

  const handleCreateSwap = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!offerToken.trim()) return setError("Enter offer token address");
    if (!offerAmount || Number(offerAmount) <= 0) return setError("Enter valid offer amount");
    if (!requestToken.trim()) return setError("Enter request token address");
    if (!requestAmount || Number(requestAmount) <= 0) return setError("Enter valid request amount");

    setError(null);
    setIsCreating(true);
    setTxStatus("Awaiting signature...");
    try {
      await createSwap(
        walletAddress,
        offerToken.trim(),
        BigInt(Math.floor(Number(offerAmount) * 1e7)),
        requestToken.trim(),
        BigInt(Math.floor(Number(requestAmount) * 1e7))
      );
      setTxStatus("Swap created on-chain!");
      setOfferToken("");
      setOfferAmount("");
      setRequestToken("");
      setRequestAmount("");
      setTimeout(() => setTxStatus(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsCreating(false);
    }
  }, [walletAddress, offerToken, offerAmount, requestToken, requestAmount]);

  const handleAcceptSwap = useCallback(async (swapId: number) => {
    if (!walletAddress) return setError("Connect wallet first");
    setError(null);
    setProcessingSwapId(swapId);
    setTxStatus("Accepting swap — approve token transfers in your wallet...");
    try {
      await acceptSwap(walletAddress, swapId);
      setTxStatus("Swap accepted! Tokens exchanged.");
      setTimeout(() => setTxStatus(null), 4000);
      await loadActiveSwaps();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setProcessingSwapId(null);
    }
  }, [walletAddress, loadActiveSwaps]);

  const handleCancelSwap = useCallback(async (swapId: number) => {
    if (!walletAddress) return setError("Connect wallet first");
    setError(null);
    setProcessingSwapId(swapId);
    setTxStatus("Cancelling swap...");
    try {
      await cancelSwap(walletAddress, swapId);
      setTxStatus("Swap cancelled.");
      setTimeout(() => setTxStatus(null), 4000);
      await loadActiveSwaps();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setProcessingSwapId(null);
    }
  }, [walletAddress, loadActiveSwaps]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "browse", label: "Browse", icon: <ListIcon />, color: "#4fc3f7" },
    { key: "create", label: "Create", icon: <SwapIcon />, color: "#7c6cf0" },
    { key: "my", label: "My Swaps", icon: <UserIcon />, color: "#fbbf24" },
  ];

  const mySwaps = swaps.filter((s) => walletAddress && s.creator === walletAddress);

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("on-chain") || txStatus.includes("accepted") || txStatus.includes("cancelled") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c6cf0]">
                  <path d="M16 3h5v5" />
                  <path d="M8 21H3v-5" />
                  <path d="M21 3 9 15" />
                  <path d="M3 21l12-12" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Token Swap Widget</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Browse */}
            {activeTab === "browse" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/25">Active swap offers</p>
                  <button
                    onClick={loadActiveSwaps}
                    disabled={isLoadingSwaps}
                    className="text-white/20 hover:text-white/40 text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <RefreshIcon />
                    Refresh
                  </button>
                </div>

                {isLoadingSwaps ? (
                  <div className="flex items-center justify-center py-12 text-white/20 text-sm">
                    <SpinnerIcon />
                    <span className="ml-2">Loading swaps...</span>
                  </div>
                ) : swaps.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-white/15 mb-3 flex justify-center">
                      <SwapIcon />
                    </div>
                    <p className="text-sm text-white/30">No active swaps</p>
                    <p className="text-xs text-white/15 mt-1">Be the first to create one!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {swaps.map((swap) => (
                      <SwapCard
                        key={swap.id}
                        swap={swap}
                        walletAddress={walletAddress}
                        onAccept={handleAcceptSwap}
                        onCancel={handleCancelSwap}
                        isProcessing={processingSwapId === swap.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create */}
            {activeTab === "create" && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-white/25 mb-4">
                    Create a swap offer. Anyone can accept it. You&apos;ll need to approve the contract to spend your offer tokens.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/20">You Offer</p>
                  <Input
                    label="Token Address"
                    value={offerToken}
                    onChange={(e) => setOfferToken(e.target.value)}
                    placeholder="G..."
                  />
                  <Input
                    label="Amount"
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="100"
                  />
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center gap-2 text-white/20">
                    <ArrowRightIcon />
                    <span className="text-xs font-medium">FOR</span>
                    <ArrowRightIcon />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/20">You Request</p>
                  <Input
                    label="Token Address"
                    value={requestToken}
                    onChange={(e) => setRequestToken(e.target.value)}
                    placeholder="G..."
                  />
                  <Input
                    label="Amount"
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="200"
                  />
                </div>

                {walletAddress ? (
                  <ShimmerButton onClick={handleCreateSwap} disabled={isCreating} shimmerColor="#7c6cf0" className="w-full">
                    {isCreating ? <><SpinnerIcon /> Creating...</> : <><SwapIcon /> Create Swap</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to create swaps
                  </button>
                )}
              </div>
            )}

            {/* My Swaps */}
            {activeTab === "my" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/25">Swaps you created</p>
                  <button
                    onClick={loadActiveSwaps}
                    disabled={isLoadingSwaps}
                    className="text-white/20 hover:text-white/40 text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <RefreshIcon />
                    Refresh
                  </button>
                </div>

                {!walletAddress ? (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] py-8 text-sm text-[#fbbf24]/60 hover:border-[#fbbf24]/30 hover:text-[#fbbf24]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to see your swaps
                  </button>
                ) : isLoadingSwaps ? (
                  <div className="flex items-center justify-center py-12 text-white/20 text-sm">
                    <SpinnerIcon />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : mySwaps.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-white/15 mb-3 flex justify-center">
                      <UserIcon />
                    </div>
                    <p className="text-sm text-white/30">No swaps yet</p>
                    <p className="text-xs text-white/15 mt-1">Create a swap offer in the Create tab!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mySwaps.map((swap) => (
                      <SwapCard
                        key={swap.id}
                        swap={swap}
                        walletAddress={walletAddress}
                        onAccept={handleAcceptSwap}
                        onCancel={handleCancelSwap}
                        isProcessing={processingSwapId === swap.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Token Swap Widget &middot; Soroban</p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
              <span className="font-mono text-[9px] text-white/15">Permissionless</span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
