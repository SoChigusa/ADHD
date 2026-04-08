"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Whisper } from "@/lib/types";

export type FloatingWhisper = {
  instanceId: string;
  whisperId: string;
  text: string;
  left: number;
  top: number;
  driftX: number;
  driftY: number;
  durationMs: number;
  rotationStart: number;
  rotationEnd: number;
  hue: number;
};

function randomPointInEllipse(xRadius = 37, yRadius = 27) {
  let x = 0;
  let y = 0;

  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
  } while (x * x + y * y > 1);

  return {
    left: 50 + x * xRadius,
    top: 50 + y * yRadius,
  };
}

function buildFloatingWhisper(whisper: Whisper): FloatingWhisper {
  const { left, top } = randomPointInEllipse();
  const driftTarget = randomPointInEllipse(15, 11);

  return {
    instanceId: `${whisper.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    whisperId: whisper.id,
    text: whisper.text,
    left,
    top,
    driftX: driftTarget.left - 50,
    driftY: driftTarget.top - 50,
    durationMs: 5600 + Math.round(Math.random() * 3600),
    rotationStart: -5 + Math.random() * 10,
    rotationEnd: -7 + Math.random() * 14,
    hue: Math.round(Math.random() * 32),
  };
}

export function useFloatingWhispers(whispers: Whisper[], maxVisible = 6) {
  const [activeWhispers, setActiveWhispers] = useState<FloatingWhisper[]>([]);
  const activeCountRef = useRef(0);

  useEffect(() => {
    activeCountRef.current = activeWhispers.length;
  }, [activeWhispers.length]);

  const spawnWhisper = useEffectEvent(() => {
    if (!whispers.length || activeCountRef.current >= maxVisible) {
      return;
    }

    const whisper = whispers[Math.floor(Math.random() * whispers.length)];
    const nextWhisper = buildFloatingWhisper(whisper);

    activeCountRef.current += 1;
    setActiveWhispers((current) => [...current, nextWhisper]);

    window.setTimeout(() => {
      activeCountRef.current = Math.max(0, activeCountRef.current - 1);
      setActiveWhispers((current) =>
        current.filter((item) => item.instanceId !== nextWhisper.instanceId),
      );
    }, nextWhisper.durationMs + 220);
  });

  useEffect(() => {
    setActiveWhispers([]);
    activeCountRef.current = 0;
  }, [whispers]);

  useEffect(() => {
    if (!whispers.length) {
      return;
    }

    let active = true;
    let loopId = 0;
    const warmupIds: number[] = [];

    const loop = () => {
      if (!active) {
        return;
      }

      spawnWhisper();
      loopId = window.setTimeout(loop, 900 + Math.random() * 1700);
    };

    for (let index = 0; index < Math.min(3, whispers.length); index += 1) {
      warmupIds.push(
        window.setTimeout(() => {
          spawnWhisper();
        }, index * 260),
      );
    }

    loop();

    return () => {
      active = false;
      window.clearTimeout(loopId);
      warmupIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [maxVisible, spawnWhisper, whispers.length]);

  return activeWhispers;
}
