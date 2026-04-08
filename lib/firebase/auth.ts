"use client";

import type { User } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./config";

function getAuthInstance() {
  if (!auth) {
    throw new Error("Firebase の環境変数が不足しているため、認証を利用できません。");
  }

  return auth;
}

let persistencePromise: Promise<void> | null = null;

async function prepareAuth() {
  const instance = getAuthInstance();

  if (!persistencePromise) {
    persistencePromise = setPersistence(instance, browserLocalPersistence);
  }

  await persistencePromise;
  return instance;
}

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  const instance = getAuthInstance();
  return onAuthStateChanged(instance, callback);
}

export async function signInWithGoogle() {
  const instance = await prepareAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(instance, provider);
}

export async function signOutUser() {
  const instance = getAuthInstance();
  await signOut(instance);
}
