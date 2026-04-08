"use client";

import type { CSSProperties } from "react";
import { useFloatingWhispers } from "@/hooks/use-floating-whispers";
import type { Whisper } from "@/lib/types";
import { BrainGraphic } from "./brain-graphic";

type BrainStageProps = {
  whispers: Whisper[];
  eyebrow: string;
  title: string;
  description: string;
  emptyText: string;
};

export function BrainStage({
  whispers,
  eyebrow,
  title,
  description,
  emptyText,
}: BrainStageProps) {
  const floatingWhispers = useFloatingWhispers(whispers);

  return (
    <section className="brainStage">
      <div className="brainMeta">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="brainCanvas">
        <div className="brainAura brainAuraLeft" />
        <div className="brainAura brainAuraRight" />
        <BrainGraphic />

        <div className="brainMarkers" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        {floatingWhispers.map((whisper) => (
          <article
            key={whisper.instanceId}
            className="whisperBubble"
            style={
              {
                left: `${whisper.left}%`,
                top: `${whisper.top}%`,
                "--drift-x": `${whisper.driftX}px`,
                "--drift-y": `${whisper.driftY}px`,
                "--duration": `${whisper.durationMs}ms`,
                "--rotate-start": `${whisper.rotationStart}deg`,
                "--rotate-end": `${whisper.rotationEnd}deg`,
                "--bubble-hue": `${whisper.hue}deg`,
              } as CSSProperties
            }
          >
            <p>{whisper.text}</p>
          </article>
        ))}

        {!whispers.length ? <p className="brainEmpty">{emptyText}</p> : null}
      </div>
    </section>
  );
}
