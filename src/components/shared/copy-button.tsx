"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  onCopy?: () => void;
}

export default function CopyButton({
  text,
  className,
  label = "Copy",
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success("Copied to clipboard");
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        copied
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:scale-95",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
