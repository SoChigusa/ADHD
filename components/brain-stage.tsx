"use client";

import type { CSSProperties } from "react";
import { useStreamingWhispers } from "@/hooks/use-streaming-whispers";
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
  const streamingWhispers = useStreamingWhispers(whispers);

  return (
    <section className="brainStage">
      <div aria-label="公開されたつぶやき" className="brainCanvas" role="region">
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

        <div aria-hidden="true" className="whisperStream">
          {streamingWhispers.map((whisper) => (
            <p
              key={whisper.instanceId}
              className="streamingWhisper"
              style={
                {
                  top: `${whisper.top}%`,
                  "--duration": `${whisper.durationMs}ms`,
                  "--font-size": `${whisper.fontSizeRem}rem`,
                  "--font-weight": whisper.fontWeight,
                  "--opacity": whisper.opacity,
                } as CSSProperties
              }
            >
              {whisper.text}
            </p>
          ))}
        </div>

        <ul className="reducedMotionWhispers">
          {whispers.slice(0, 12).map((whisper) => (
            <li key={whisper.id}>{whisper.text}</li>
          ))}
        </ul>

        {!whispers.length ? <p className="brainEmpty">{emptyText}</p> : null}
      </div>
    </section>
  );
}
