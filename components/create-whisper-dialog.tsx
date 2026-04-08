"use client";

import { useEffect, useState } from "react";
import { MAX_WHISPER_LENGTH } from "@/lib/constants";

type CreateWhisperDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
};

export function CreateWhisperDialog({
  open,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: CreateWhisperDialogProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) {
      setText("");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSubmitting, onClose, open]);

  if (!open) {
    return null;
  }

  const remaining = MAX_WHISPER_LENGTH - text.length;

  return (
    <div className="dialogBackdrop" role="presentation" onClick={isSubmitting ? undefined : onClose}>
      <div
        className="dialogCard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-whisper-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialogHeader">
          <span className="eyebrow">New Whisper</span>
          <h2 id="create-whisper-title">頭に浮かんだことを置いていく</h2>
          <p>保存すると、つぶやきは脳の中を漂うように現れては消えていきます。</p>
        </div>

        <form
          className="dialogForm"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(text);
          }}
        >
          <label className="srOnly" htmlFor="whisper-text">
            つぶやき
          </label>
          <textarea
            id="whisper-text"
            name="whisper-text"
            autoFocus
            className="dialogTextarea"
            placeholder="今の思考をそのまま書いてください"
            maxLength={MAX_WHISPER_LENGTH}
            rows={5}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          <div className="dialogFooter">
            <div className="dialogMeta">
              <span>{remaining} 文字</span>
              {error ? <span className="dialogError">{error}</span> : null}
            </div>

            <div className="dialogActions">
              <button type="button" className="textButton" onClick={onClose} disabled={isSubmitting}>
                閉じる
              </button>
              <button
                type="submit"
                className="primaryButton"
                disabled={isSubmitting || !text.trim()}
              >
                {isSubmitting ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
