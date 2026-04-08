"use client";

import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/error-message";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { ensureUserProfile } from "@/lib/firebase/firestore";
import { signInWithGoogle, signOutUser, subscribeToAuthState } from "@/lib/firebase/auth";
import type { UserProfile } from "@/lib/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuthSession() {
  const [status, setStatus] = useState<AuthStatus>(
    isFirebaseConfigured ? "loading" : "unauthenticated",
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : "Firebase の環境変数を設定するとログインが有効になります。",
  );
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    let active = true;

    const unsubscribe = subscribeToAuthState(async (nextUser) => {
      if (!active) {
        return;
      }

      if (!nextUser) {
        setUser(null);
        setProfile(null);
        setStatus("unauthenticated");
        setIsSigningIn(false);
        setIsSigningOut(false);
        return;
      }

      setStatus("loading");

      try {
        const ensuredProfile = await ensureUserProfile(nextUser);
        if (!active) {
          return;
        }

        setUser(nextUser);
        setProfile(ensuredProfile);
        setStatus("authenticated");
        setError(null);
      } catch (nextError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(nextError, "ログイン状態の取得に失敗しました。"));
        setUser(null);
        setProfile(null);
        setStatus("unauthenticated");
      } finally {
        if (active) {
          setIsSigningIn(false);
          setIsSigningOut(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    if (!isFirebaseConfigured) {
      return;
    }

    setIsSigningIn(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (nextError) {
      setError(getErrorMessage(nextError, "Google ログインを開始できませんでした。"));
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);

    try {
      await signOutUser();
    } catch (nextError) {
      setError(getErrorMessage(nextError, "ログアウトに失敗しました。"));
      setIsSigningOut(false);
    }
  };

  return {
    status,
    user,
    profile,
    error,
    isSigningIn,
    isSigningOut,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
