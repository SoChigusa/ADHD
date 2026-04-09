"use client";

import type { CSSProperties } from "react";
import { useFloatingWhispers } from "@/hooks/use-floating-whispers";
import type { Whisper } from "@/lib/types";
import { BrainGraphic } from "./brain-graphic";
import type { BrainGraphicCropPreset, BrainGraphicVariant } from "./brain-graphic";

type BrainStageProps = {
  whispers: Whisper[];
  emptyText: string;
  graphicVariant?: BrainGraphicVariant;
  graphicCropPreset?: BrainGraphicCropPreset;
};

export function BrainStage({
  whispers,
  emptyText,
  graphicVariant = "profile-cutaway",
  graphicCropPreset = "top-60",
}: BrainStageProps) {
  const floatingWhispers = useFloatingWhispers(whispers);

  return (
    <section className="brainStage">
      <div className="brainCanvas">
        <div className="brainAura brainAuraLeft" />
        <div className="brainAura brainAuraRight" />
        <BrainGraphic variant={graphicVariant} cropPreset={graphicCropPreset} />

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
