"use client";

import type { User } from "firebase/auth";
import type { Unsubscribe } from "firebase/firestore";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, runTransaction, setDoc } from "firebase/firestore";
import { MAX_WHISPER_LENGTH } from "@/lib/constants";
import type { PublicProfile, UserProfile, Whisper } from "@/lib/types";
import { createShareId } from "@/lib/share-id";
import { db } from "./config";

function getDatabase() {
  if (!db) {
    throw new Error("Firebase の環境変数が不足しているため、Firestore を利用できません。");
  }

  return db;
}

function mapUserProfile(userId: string, data: Record<string, unknown>): UserProfile {
  return {
    uid: userId,
    displayName: String(data.displayName ?? "Anonymous"),
    email: String(data.email ?? ""),
    photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
    shareId: String(data.shareId ?? ""),
    createdAtMs: Number(data.createdAtMs ?? Date.now()),
    updatedAtMs: Number(data.updatedAtMs ?? Date.now()),
  };
}

function mapPublicProfile(data: Record<string, unknown>): PublicProfile {
  return {
    userId: String(data.userId ?? ""),
    displayName: String(data.displayName ?? "Anonymous"),
    photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
    shareId: String(data.shareId ?? ""),
    createdAtMs: Number(data.createdAtMs ?? Date.now()),
    updatedAtMs: Number(data.updatedAtMs ?? Date.now()),
  };
}

function mapWhisper(id: string, data: Record<string, unknown>): Whisper {
  return {
    id,
    userId: String(data.userId ?? ""),
    text: String(data.text ?? ""),
    createdAtMs: Number(data.createdAtMs ?? Date.now()),
    updatedAtMs: Number(data.updatedAtMs ?? Date.now()),
  };
}

async function syncExistingProfile(user: User, profile: UserProfile) {
  const database = getDatabase();
  const now = Date.now();
  const nextProfile = {
    displayName: user.displayName ?? profile.displayName,
    email: user.email ?? profile.email,
    photoURL: user.photoURL ?? profile.photoURL,
    updatedAtMs: now,
  };

  await Promise.all([
    setDoc(doc(database, "users", user.uid), nextProfile, { merge: true }),
    setDoc(
      doc(database, "publicProfiles", profile.shareId),
      {
        userId: user.uid,
        displayName: user.displayName ?? profile.displayName,
        photoURL: user.photoURL ?? profile.photoURL,
        shareId: profile.shareId,
        updatedAtMs: now,
      },
      { merge: true },
    ),
  ]);

  return {
    ...profile,
    ...nextProfile,
  };
}

export async function ensureUserProfile(user: User) {
  const database = getDatabase();
  const userRef = doc(database, "users", user.uid);
  const existingUser = await getDoc(userRef);

  if (existingUser.exists()) {
    return syncExistingProfile(
      user,
      mapUserProfile(user.uid, existingUser.data() as Record<string, unknown>),
    );
  }

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const shareId = createShareId(user.displayName ?? user.email);
    const publicProfileRef = doc(database, "publicProfiles", shareId);
    const now = Date.now();

    const userProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName ?? "Mind Drift User",
      email: user.email ?? "",
      photoURL: user.photoURL,
      shareId,
      createdAtMs: now,
      updatedAtMs: now,
    };

    const publicProfile: PublicProfile = {
      userId: user.uid,
      displayName: user.displayName ?? "Mind Drift User",
      photoURL: user.photoURL,
      shareId,
      createdAtMs: now,
      updatedAtMs: now,
    };

    try {
      await runTransaction(database, async (transaction) => {
        const [latestUser, latestPublicProfile] = await Promise.all([
          transaction.get(userRef),
          transaction.get(publicProfileRef),
        ]);

        if (latestUser.exists()) {
          return;
        }

        if (latestPublicProfile.exists()) {
          throw new Error("share-id-taken");
        }

        transaction.set(userRef, userProfile);
        transaction.set(publicProfileRef, publicProfile);
      });

      const createdUser = await getDoc(userRef);
      if (createdUser.exists()) {
        return mapUserProfile(user.uid, createdUser.data() as Record<string, unknown>);
      }

      return userProfile;
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.message === "share-id-taken") {
        continue;
      }
    }
  }

  throw lastError ?? new Error("プロフィールの作成に失敗しました。");
}

export async function addWhisper(input: { shareId: string; userId: string; text: string }) {
  const database = getDatabase();
  const text = input.text.trim();

  if (!text) {
    throw new Error("つぶやきが空のままです。");
  }

  if (text.length > MAX_WHISPER_LENGTH) {
    throw new Error(`つぶやきは ${MAX_WHISPER_LENGTH} 文字以内で入力してください。`);
  }

  const now = Date.now();

  await addDoc(collection(database, "publicProfiles", input.shareId, "whispers"), {
    userId: input.userId,
    text,
    createdAtMs: now,
    updatedAtMs: now,
  });
}

export function subscribeToPublicProfile(
  shareId: string,
  onData: (profile: PublicProfile | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const database = getDatabase();
  return onSnapshot(
    doc(database, "publicProfiles", shareId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }

      onData(mapPublicProfile(snapshot.data() as Record<string, unknown>));
    },
    (error) => onError(error),
  );
}

export function subscribeToWhispers(
  shareId: string,
  onData: (whispers: Whisper[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const database = getDatabase();
  const whispersQuery = query(
    collection(database, "publicProfiles", shareId, "whispers"),
    orderBy("createdAtMs", "desc"),
  );

  return onSnapshot(
    whispersQuery,
    (snapshot) => {
      onData(
        snapshot.docs.map((document) =>
          mapWhisper(document.id, document.data() as Record<string, unknown>),
        ),
      );
    },
    (error) => onError(error),
  );
}
