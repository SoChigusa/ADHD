"use client";

import { useEffect, useRef, useState } from "react";
import type { Whisper } from "@/lib/types";

export type StreamingWhisper = {
  instanceId: string;
  whisperId: string;
  text: string;
  top: number;
  durationMs: number;
  fontSizeRem: number;
  fontWeight: number;
  opacity: number;
};

function chooseRandomTop(
  fontSizeRem: number,
  activeWhispers: StreamingWhisper[],
) {
  let openRanges = [{ start: 8, end: 92 }];

  activeWhispers.forEach((activeWhisper) => {
    const minimumDistance =
      2.5 + (fontSizeRem + activeWhisper.fontSizeRem) * 2;
    const blockedStart = activeWhisper.top - minimumDistance;
    const blockedEnd = activeWhisper.top + minimumDistance;

    openRanges = openRanges.flatMap((range) => {
      if (blockedEnd <= range.start || blockedStart >= range.end) {
        return [range];
      }

      const remainingRanges: typeof openRanges = [];
      if (blockedStart > range.start) {
        remainingRanges.push({ start: range.start, end: blockedStart });
      }
      if (blockedEnd < range.end) {
        remainingRanges.push({ start: blockedEnd, end: range.end });
      }
      return remainingRanges;
    });
  });

  const totalOpenSpace = openRanges.reduce(
    (total, range) => total + range.end - range.start,
    0,
  );
  if (totalOpenSpace <= 0) {
    return null;
  }

  let offset = Math.random() * totalOpenSpace;
  for (const range of openRanges) {
    const rangeSize = range.end - range.start;
    if (offset <= rangeSize) {
      return range.start + offset;
    }
    offset -= rangeSize;
  }

  return openRanges[openRanges.length - 1].end;
}

function buildStreamingWhisper(
  whisper: Whisper,
  activeWhispers: StreamingWhisper[],
): StreamingWhisper | null {
  const textLength = Array.from(whisper.text.trim()).length;
  const fontSizeRem = 0.9 + Math.random() * 1.25;
  const top = chooseRandomTop(fontSizeRem, activeWhispers);
  if (top === null) {
    return null;
  }

  const durationMs = Math.max(
    7200,
    Math.min(
      11600,
      11600 -
        Math.min(textLength, 100) * 38 +
        Math.round(Math.random() * 900 - 450),
    ),
  );

  return {
    instanceId: `${whisper.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    whisperId: whisper.id,
    text: whisper.text,
    top,
    durationMs,
    fontSizeRem,
    fontWeight: [600, 700, 800][Math.floor(Math.random() * 3)],
    opacity: 0.82 + Math.random() * 0.18,
  };
}

export function useStreamingWhispers(whispers: Whisper[], maxVisible = 8) {
  const [activeWhispers, setActiveWhispers] = useState<StreamingWhisper[]>([]);
  const activeWhispersRef = useRef<StreamingWhisper[]>([]);
  const activeCountRef = useRef(0);
  const lastWhisperIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeCountRef.current = activeWhispers.length;
  }, [activeWhispers.length]);

  useEffect(() => {
    setActiveWhispers([]);
    activeWhispersRef.current = [];
    activeCountRef.current = 0;
    lastWhisperIdRef.current = null;
  }, [whispers]);

  useEffect(() => {
    if (!whispers.length) {
      return;
    }

    let active = true;
    let loopId = 0;
    const warmupIds: number[] = [];
    const removalIds: number[] = [];
    const spawnWhisper = () => {
      if (!whispers.length || activeCountRef.current >= maxVisible) {
        return;
      }

      let whisper = whispers[Math.floor(Math.random() * whispers.length)];
      if (whispers.length > 1 && whisper.id === lastWhisperIdRef.current) {
        whisper = whispers[(whispers.indexOf(whisper) + 1) % whispers.length];
      }
      lastWhisperIdRef.current = whisper.id;

      const nextWhisper = buildStreamingWhisper(
        whisper,
        activeWhispersRef.current,
      );
      if (!nextWhisper) {
        return;
      }

      activeCountRef.current += 1;
      activeWhispersRef.current = [...activeWhispersRef.current, nextWhisper];
      setActiveWhispers(activeWhispersRef.current);

      removalIds.push(
        window.setTimeout(() => {
          activeCountRef.current = Math.max(0, activeCountRef.current - 1);
          activeWhispersRef.current = activeWhispersRef.current.filter(
            (item) => item.instanceId !== nextWhisper.instanceId,
          );
          setActiveWhispers(activeWhispersRef.current);
        }, nextWhisper.durationMs + 220),
      );
    };

    const loop = () => {
      if (!active) {
        return;
      }

      spawnWhisper();
      loopId = window.setTimeout(loop, 650 + Math.random() * 2450);
    };

    for (let index = 0; index < Math.min(3, whispers.length); index += 1) {
      warmupIds.push(
        window.setTimeout(() => {
          spawnWhisper();
        }, Math.random() * 1700),
      );
    }

    loopId = window.setTimeout(loop, 850 + Math.random() * 1650);

    return () => {
      active = false;
      window.clearTimeout(loopId);
      warmupIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      removalIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [maxVisible, whispers]);

  return activeWhispers;
}
