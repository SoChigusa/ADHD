"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/error-message";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { subscribeToWhispers } from "@/lib/firebase/firestore";
import type { Whisper } from "@/lib/types";

export function useWhispers(shareId: string | null) {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [loading, setLoading] = useState(Boolean(shareId));
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : "Firebase の環境変数が未設定です。",
  );

  useEffect(() => {
    if (!shareId) {
      setWhispers([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToWhispers(
      shareId,
      (nextWhispers) => {
        setWhispers(nextWhispers);
        setLoading(false);
      },
      (nextError) => {
        setError(getErrorMessage(nextError, "つぶやきを読み込めませんでした。"));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [shareId]);

  return {
    whispers,
    loading,
    error,
  };
}
