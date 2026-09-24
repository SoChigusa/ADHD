"use client";

import { BrainStage } from "./brain-stage";
import { usePublicProfile } from "@/hooks/use-public-profile";
import { useWhispers } from "@/hooks/use-whispers";

type PublicEmbedViewProps = {
  shareId: string;
};

export function PublicEmbedView({ shareId }: PublicEmbedViewProps) {
  const { profile, loading: profileLoading, error: profileError } =
    usePublicProfile(shareId);
  const { whispers, loading: whispersLoading, error: whispersError } =
    useWhispers(shareId);
  const loading = profileLoading || whispersLoading;
  const error = profileError ?? whispersError;

  if (loading) {
    return <main className="embedStatus">つぶやきを読み込んでいます</main>;
  }

  if (!profile || error) {
    return <main className="embedStatus">つぶやきを読み込めませんでした。</main>;
  }

  return (
    <main className="embedShell">
      <BrainStage
        whispers={whispers}
        emptyText="まだ公開されたつぶやきはありません。"
        graphicVariant="profile-cutaway"
        graphicCropPreset="top-60"
      />
    </main>
  );
}
