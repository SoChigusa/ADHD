"use client";

import Link from "next/link";
import { usePublicProfile } from "@/hooks/use-public-profile";
import { useWhispers } from "@/hooks/use-whispers";
import { BrainStage } from "./brain-stage";

type PublicShareViewProps = {
  shareId: string;
};

export function PublicShareView({ shareId }: PublicShareViewProps) {
  const { profile, loading: profileLoading, error: profileError } = usePublicProfile(shareId);
  const { whispers, loading: whispersLoading, error: whispersError } = useWhispers(shareId);

  const loading = profileLoading || whispersLoading;
  const error = profileError ?? whispersError;

  if (loading) {
    return (
      <main className="pageShell">
        <section className="loadingPanel">
          <span className="eyebrow">Public Share</span>
          <h1>公開ページを読み込んでいます</h1>
          <p>つぶやきの流れを Firestore から取得しています。</p>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="pageShell">
        <section className="loadingPanel">
          <span className="eyebrow">Not Found</span>
          <h1>この公開ページは見つかりませんでした</h1>
          <p>URL が正しいか確認するか、新しい共有リンクを開いてください。</p>
          <Link className="workspaceLink" href="/">
            トップへ戻る
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="pageShell">
      <div className="workspaceHeader">
        <div>
          <span className="eyebrow">Public Share</span>
          <h1>{profile.displayName} さんのつぶやき</h1>
        </div>

        <div className="workspaceLinks">
          <Link className="workspaceLink" href="/">
            自分のページを開く
          </Link>
        </div>
      </div>

      <BrainStage
        whispers={whispers}
        eyebrow="Open Stream"
        title="ログインなしで眺められる思考の流れ"
        description="保存されたつぶやきがリアルタイムに現れ、ゆっくり漂って消えていきます。"
        emptyText="まだ公開されたつぶやきはありません。"
      />

      <div className="workspaceFooter">
        <p>{whispers.length} 件のつぶやきが公開されています。</p>
      </div>

      {error ? <p className="statusMessage errorMessage">{error}</p> : null}
    </main>
  );
}
