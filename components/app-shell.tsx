"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SAMPLE_WHISPERS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error-message";
import { addWhisper } from "@/lib/firebase/firestore";
import type { Whisper } from "@/lib/types";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useWhispers } from "@/hooks/use-whispers";
import { BrainStage } from "./brain-stage";
import { CreateWhisperDialog } from "./create-whisper-dialog";
import { ManageWhispersDialog } from "./manage-whispers-dialog";

const sampleWhispers: Whisper[] = SAMPLE_WHISPERS.map((text, index) => ({
  id: `sample-${index}`,
  userId: "sample",
  text,
  createdAtMs: Date.now() - index * 1000,
  updatedAtMs: Date.now() - index * 1000,
}));

export function AppShell() {
  const { status, profile, error, isSigningIn, isSigningOut, signIn, signOut } = useAuthSession();
  const { whispers, loading: whispersLoading, error: whispersError } = useWhispers(profile?.shareId ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [origin, setOrigin] = useState(process.env.NEXT_PUBLIC_APP_URL ?? "");

  useEffect(() => {
    if (origin || typeof window === "undefined") {
      return;
    }

    setOrigin(window.location.origin);
  }, [origin]);

  const shareUrl = profile ? `${origin.replace(/\/$/, "")}/share/${profile.shareId}` : "";

  const handleSubmit = async (text: string) => {
    if (!profile) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await addWhisper({
        shareId: profile.shareId,
        userId: profile.uid,
        text,
      });
      setDialogOpen(false);
    } catch (nextError) {
      setSubmitError(getErrorMessage(nextError, "つぶやきを保存できませんでした。"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="pageShell">
        <section className="loadingPanel">
          <span className="eyebrow">Mind Drift</span>
          <h1>思考の粒を読み込んでいます</h1>
          <p>Firebase と接続しながら、あなたの脳内に漂うつぶやきを集めています。</p>
        </section>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="pageShell">
        <section className="heroShell">
          <div className="heroCopy">
            <span className="eyebrow">Mind Drift</span>
            <h1>浮かんでは消える思考を、そのまま残す。</h1>
            <p>
              Google アカウントでログインすると、つぶやきを Firebase に保存し、
              脳内を漂うイメージでリアルタイムに眺められます。
            </p>

            <button className="primaryButton heroButton" onClick={signIn} disabled={isSigningIn}>
              {isSigningIn ? "Google に接続中..." : "Google でログイン"}
            </button>

            <ul className="heroList">
              <li>つぶやきは Firestore に保存</li>
              <li>認証は Firebase Authentication の Google ログイン</li>
              <li>公開ページは URL を知っていればログイン不要で閲覧可能</li>
            </ul>

            {error ? <p className="statusMessage errorMessage">{error}</p> : null}
          </div>

          <BrainStage
            whispers={sampleWhispers}
            emptyText="ログインすると、ここにあなたのつぶやきが流れ始めます。"
            graphicVariant="profile-cutaway"
            graphicCropPreset="top-60"
          />
        </section>
      </main>
    );
  }

  return (
    <main className="pageShell">
      <div className="workspaceHeader">
        <div className="workspaceTitleGroup">
          <span className="eyebrow">Private Space</span>
          <h1>{profile?.displayName ?? "Mind Drift"}</h1>
        </div>

        <div className="workspaceLinks">
          {shareUrl ? (
            <Link
              className="workspaceLink"
              href={`/share/${profile?.shareId}`}
              target="_blank"
              rel="noreferrer"
            >
              公開ページを見る
            </Link>
          ) : null}
          <button className="textButton" onClick={signOut} disabled={isSigningOut}>
            {isSigningOut ? "ログアウト中..." : "ログアウト"}
          </button>
        </div>
      </div>

      <BrainStage
        whispers={whispers}
        emptyText="右下の追加ボタンから、最初のつぶやきを置いてみましょう。"
        graphicVariant="profile-cutaway"
        graphicCropPreset="top-60"
      />

      <div className="workspaceFooter">
        <p>
          {whispersLoading
            ? "つぶやきを同期しています..."
            : `${whispers.length} 件のつぶやきが保存されています。`}
        </p>
      </div>

      {error ? <p className="statusMessage errorMessage">{error}</p> : null}
      {whispersError ? <p className="statusMessage errorMessage">{whispersError}</p> : null}

      <div className="floatingActions floatingActions--stack">
        <button
          className="manageButton"
          type="button"
          onClick={() => {
            setDialogOpen(false);
            setManageDialogOpen(true);
          }}
        >
          一覧
        </button>
        <button
          className="addButton"
          type="button"
          onClick={() => {
            setManageDialogOpen(false);
            setDialogOpen(true);
          }}
          aria-label="つぶやきを追加"
        >
          +
        </button>
      </div>

      <CreateWhisperDialog
        open={dialogOpen}
        isSubmitting={isSubmitting}
        error={submitError}
        onClose={() => {
          if (!isSubmitting) {
            setDialogOpen(false);
          }
        }}
        onSubmit={handleSubmit}
      />

      {profile ? (
        <ManageWhispersDialog
          open={manageDialogOpen}
          shareId={profile.shareId}
          whispers={whispers}
          onClose={() => setManageDialogOpen(false)}
        />
      ) : null}
    </main>
  );
}
