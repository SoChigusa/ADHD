"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/error-message";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { subscribeToPublicProfile } from "@/lib/firebase/firestore";
import type { PublicProfile } from "@/lib/types";

export function usePublicProfile(shareId: string) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : "Firebase の環境変数が未設定です。",
  );

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToPublicProfile(
      shareId,
      (nextProfile) => {
        setProfile(nextProfile);
        setLoading(false);
      },
      (nextError) => {
        setError(getErrorMessage(nextError, "公開プロフィールを読み込めませんでした。"));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [shareId]);

  return {
    profile,
    loading,
    error,
  };
}
