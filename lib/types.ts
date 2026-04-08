export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  shareId: string;
  createdAtMs: number;
  updatedAtMs: number;
};

export type PublicProfile = {
  userId: string;
  displayName: string;
  photoURL: string | null;
  shareId: string;
  createdAtMs: number;
  updatedAtMs: number;
};

export type Whisper = {
  id: string;
  userId: string;
  text: string;
  createdAtMs: number;
  updatedAtMs: number;
};
