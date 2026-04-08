"use client";

import { useEffect, useState } from "react";
import { MAX_WHISPER_LENGTH } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error-message";
import { deleteWhisper, updateWhisper } from "@/lib/firebase/firestore";
import type { Whisper } from "@/lib/types";

type ManageWhispersDialogProps = {
  open: boolean;
  shareId: string;
  whispers: Whisper[];
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function ManageWhispersDialog({
  open,
  shareId,
  whispers,
  onClose,
}: ManageWhispersDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setEditingText("");
      setConfirmDeleteId(null);
      setActiveItemId(null);
      setError(null);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !activeItemId) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItemId, onClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingId && !whispers.some((whisper) => whisper.id === editingId)) {
      setEditingId(null);
      setEditingText("");
      setActiveItemId(null);
      setError(null);
    }

    if (confirmDeleteId && !whispers.some((whisper) => whisper.id === confirmDeleteId)) {
      setConfirmDeleteId(null);
      setActiveItemId(null);
      setError(null);
    }
  }, [confirmDeleteId, editingId, open, whispers]);

  if (!open) {
    return null;
  }

  const remaining = MAX_WHISPER_LENGTH - editingText.length;

  const startEditing = (whisper: Whisper) => {
    setEditingId(whisper.id);
    setEditingText(whisper.text);
    setConfirmDeleteId(null);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
    setError(null);
  };

  const handleSave = async () => {
    if (!editingId || !editingText.trim()) {
      return;
    }

    setActiveItemId(editingId);
    setError(null);

    try {
      await updateWhisper({
        shareId,
        whisperId: editingId,
        text: editingText,
      });
      setEditingId(null);
      setEditingText("");
    } catch (nextError) {
      setError(getErrorMessage(nextError, "つぶやきを更新できませんでした。"));
    } finally {
      setActiveItemId(null);
    }
  };

  const handleDelete = async (whisperId: string) => {
    setActiveItemId(whisperId);
    setError(null);

    try {
      await deleteWhisper({
        shareId,
        whisperId,
      });
      if (editingId === whisperId) {
        setEditingId(null);
        setEditingText("");
      }
      setConfirmDeleteId(null);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "つぶやきを削除できませんでした。"));
    } finally {
      setActiveItemId(null);
    }
  };

  return (
    <div className="dialogBackdrop" role="presentation" onClick={activeItemId ? undefined : onClose}>
      <div
        className="dialogCard dialogCardWide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-whispers-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialogHeader manageDialogHeader">
          <div>
            <span className="eyebrow">Whisper Library</span>
            <h2 id="manage-whispers-title">つぶやきを整理する</h2>
            <p>一覧をスクロールしながら、内容の編集と削除をその場で行えます。</p>
          </div>
          <p className="manageDialogCount">{whispers.length} 件</p>
        </div>

        <div className="manageDialogBody">
          {whispers.length ? (
            <div className="manageWhisperList">
              {whispers.map((whisper) => {
                const isEditing = editingId === whisper.id;
                const isDeleting = confirmDeleteId === whisper.id;
                const isBusy = activeItemId === whisper.id;
                const wasEdited = whisper.updatedAtMs > whisper.createdAtMs;

                return (
                  <article
                    key={whisper.id}
                    className={`manageWhisperItem${isEditing ? " isEditing" : ""}`}
                  >
                    <div className="manageWhisperItemHeader">
                      <div className="manageWhisperMeta">
                        <time dateTime={new Date(whisper.createdAtMs).toISOString()}>
                          {dateFormatter.format(whisper.createdAtMs)}
                        </time>
                        {wasEdited ? <span className="manageEditedBadge">編集済み</span> : null}
                      </div>

                      <div className="manageWhisperActions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="softButton"
                              onClick={cancelEditing}
                              disabled={isBusy}
                            >
                              キャンセル
                            </button>
                            <button
                              type="button"
                              className="primaryButton compactButton"
                              onClick={handleSave}
                              disabled={isBusy || !editingText.trim()}
                            >
                              {isBusy ? "保存中..." : "保存"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="softButton"
                              onClick={() => startEditing(whisper)}
                              disabled={Boolean(activeItemId)}
                            >
                              編集
                            </button>
                            <button
                              type="button"
                              className="dangerButton"
                              onClick={() => {
                                setConfirmDeleteId((current) =>
                                  current === whisper.id ? null : whisper.id,
                                );
                                setEditingId(null);
                                setEditingText("");
                                setError(null);
                              }}
                              disabled={Boolean(activeItemId)}
                            >
                              削除
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <>
                        <textarea
                          className="manageWhisperTextarea"
                          rows={4}
                          maxLength={MAX_WHISPER_LENGTH}
                          value={editingText}
                          onChange={(event) => setEditingText(event.target.value)}
                        />
                        <div className="manageWhisperFooter">
                          <span>{remaining} 文字</span>
                          {error ? <span className="dialogError">{error}</span> : null}
                        </div>
                      </>
                    ) : (
                      <p className="manageWhisperText">{whisper.text}</p>
                    )}

                    {isDeleting ? (
                      <div className="manageDeleteConfirm">
                        <p>このつぶやきを削除しますか？</p>
                        <div className="manageDeleteActions">
                          <button
                            type="button"
                            className="softButton"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isBusy}
                          >
                            やめる
                          </button>
                          <button
                            type="button"
                            className="dangerButton"
                            onClick={() => handleDelete(whisper.id)}
                            disabled={isBusy}
                          >
                            {isBusy ? "削除中..." : "削除する"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="manageEmptyState">
              <p>まだつぶやきはありません。右下の追加ボタンから最初の言葉を置いてみましょう。</p>
            </div>
          )}
        </div>

        <div className="dialogFooter manageDialogFooter">
          <div className="dialogMeta">
            <span>古いものからではなく、新しいつぶやき順に表示しています。</span>
            {error && !editingId ? <span className="dialogError">{error}</span> : null}
          </div>
          <div className="dialogActions">
            <button type="button" className="textButton" onClick={onClose} disabled={Boolean(activeItemId)}>
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
