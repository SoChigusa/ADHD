import Image from "next/image";
import { useId } from "react";

export type BrainGraphicVariant = "profile-cutaway" | "frontal-cutaway" | "organic";
export type BrainGraphicCropPreset = "top-50" | "top-55" | "top-60";

const profileCropHeights: Record<BrainGraphicCropPreset, number> = {
  "top-50": 50,
  "top-55": 55,
  "top-60": 60,
};

type BrainGraphicProps = {
  variant?: BrainGraphicVariant;
  className?: string;
  cropPreset?: BrainGraphicCropPreset;
};

type GraphicBaseProps = {
  className: string;
  idPrefix: string;
};

function OrganicGraphic({ className, idPrefix }: GraphicBaseProps) {
  const headGlow = `${idPrefix}-headGlow`;
  const brainFill = `${idPrefix}-brainFill`;
  const brainStroke = `${idPrefix}-brainStroke`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 760 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={headGlow} x1="178" y1="76" x2="554" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff3df" />
          <stop offset="1" stopColor="#d6f3ea" />
        </linearGradient>
        <linearGradient id={brainFill} x1="253" y1="122" x2="493" y2="391" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9d76" />
          <stop offset="0.52" stopColor="#f26d8a" />
          <stop offset="1" stopColor="#ffcf78" />
        </linearGradient>
        <linearGradient id={brainStroke} x1="207" y1="137" x2="544" y2="379" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffdca8" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      <path
        d="M488.1 63.4c65 19.9 111.9 79 116.2 148.8 39.8 41.1 60.8 95.2 55 150.5-8.8 85.9-80.1 150-166.6 150H316.6c-97.4 0-177.8-72.4-190.4-168.1-8.1-61.3 12.9-118.9 54.8-160C189.7 103.9 257 47.3 336 47.3c19 0 37.5 3.3 54.7 9.4 31.1-6.4 64.6-4.6 97.4 6.7Z"
        fill={`url(#${headGlow})`}
        fillOpacity="0.72"
      />

      <path
        d="M265.6 436.9c-50.1-20-86.4-67.7-86.4-123.8 0-41 19.4-77.3 49.5-100.5-2.2-8-3.4-16.5-3.4-25.2 0-53.4 43.2-96.6 96.6-96.6 20.6 0 39.8 6.4 55.6 17.4 13.8-8.2 29.8-12.9 46.8-12.9 40.7 0 75.7 26.7 87.8 63.5 41.6 8.8 72.9 45.7 72.9 89.8 0 20.6-6.8 39.6-18.4 54.8 8.4 15.6 13.1 33.5 13.1 52.4 0 60.9-49.4 110.3-110.3 110.3H265.6Z"
        fill={`url(#${brainFill})`}
        fillOpacity="0.92"
        stroke={`url(#${brainStroke})`}
        strokeWidth="10"
      />

      <path
        d="M382.4 124.1c-26.9 13.6-44.7 41.3-44.7 73.2 0 16.7 4.9 32.3 13.3 45.3-18.3 12.4-30.3 33.4-30.3 57.2 0 32.2 22.1 59.1 51.9 66.5"
        stroke="#FFF9EC"
        strokeLinecap="round"
        strokeWidth="13"
      />
      <path
        d="M421.4 122.2c27.9 11.1 47.7 38.4 47.7 70.4 0 12.7-3.1 24.7-8.5 35.3 23.7 8.5 40.6 31.1 40.6 57.7 0 19.5-9 37-23 48.4"
        stroke="#FFF9EC"
        strokeLinecap="round"
        strokeWidth="13"
      />
      <path
        d="M247.8 224.2c17.3 9.6 28.9 28 28.9 49.1 0 11.1-3.2 21.4-8.8 30 20.8 7.2 35.7 26.9 35.7 50.2 0 15.6-6.7 29.7-17.4 39.5"
        stroke="#FCE9DA"
        strokeLinecap="round"
        strokeWidth="11"
      />
      <path
        d="M522.5 208.4c-12.6 8.3-20.8 22.6-20.8 38.9 0 9.8 3 19 8.1 26.7-15.2 8.2-25.4 24.3-25.4 42.8 0 13.1 5.2 25.1 13.8 33.9"
        stroke="#FCE9DA"
        strokeLinecap="round"
        strokeWidth="11"
      />

      <circle cx="228" cy="355" r="14" fill="#FFF8EA" fillOpacity="0.72" />
      <circle cx="525" cy="143" r="10" fill="#FFF8EA" fillOpacity="0.66" />
      <circle cx="541" cy="397" r="12" fill="#FFF8EA" fillOpacity="0.58" />
      <circle cx="308" cy="139" r="8" fill="#FFF8EA" fillOpacity="0.68" />
    </svg>
  );
}

function ProfileCutawayGraphic({
  className,
  cropPreset = "top-60",
}: {
  className: string;
  cropPreset?: BrainGraphicCropPreset;
}) {
  const visibleHeightPct = profileCropHeights[cropPreset] ?? profileCropHeights["top-60"];

  return (
    <div
      aria-hidden="true"
      className={`${className} brainGraphicCrop`}
      style={{ aspectRatio: `426 / ${454 * (visibleHeightPct / 100)}` }}
    >
      <Image
        alt=""
        className="brainGraphicSource"
        draggable="false"
        fill
        src="/assets/brain/openclipart-profile-brain.svg"
        sizes="(max-width: 768px) 92vw, 840px"
      />
    </div>
  );
}

function FrontalCutawayGraphic({ className, idPrefix }: GraphicBaseProps) {
  const shellGlow = `${idPrefix}-shellGlow`;
  const shellFill = `${idPrefix}-shellFill`;
  const skullWindow = `${idPrefix}-skullWindow`;
  const brainFill = `${idPrefix}-brainFill`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 760 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={shellGlow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(381 243) rotate(90) scale(250 260)">
          <stop stopColor="#FFF7E8" />
          <stop offset="1" stopColor="#DFF2E9" />
        </radialGradient>
        <linearGradient id={shellFill} x1="165" y1="82" x2="590" y2="512" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF8EE" />
          <stop offset="1" stopColor="#E1F0EC" />
        </linearGradient>
        <linearGradient id={skullWindow} x1="240" y1="111" x2="522" y2="457" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.94" />
          <stop offset="1" stopColor="#FFEBD8" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={brainFill} x1="239" y1="119" x2="506" y2="447" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB37E" />
          <stop offset="0.55" stopColor="#F47D92" />
          <stop offset="1" stopColor="#FFD98E" />
        </linearGradient>
      </defs>

      <path
        d="M380 70c94 0 177 43 223 118 37 59 48 132 34 210-12 69-48 124-101 158-40 26-100 40-156 40-56 0-116-14-156-40-53-34-89-89-101-158-14-78-3-151 34-210 46-75 129-118 223-118Z"
        fill={`url(#${shellGlow})`}
        fillOpacity="0.8"
      />

      <path
        d="M380 87c77 0 149 32 190 94 35 52 46 120 34 194-11 62-41 111-84 142-31 21-84 34-140 34s-109-13-140-34c-43-31-73-80-84-142-12-74-1-142 34-194 41-62 113-94 190-94Z"
        fill={`url(#${shellFill})`}
        stroke="rgba(255,255,255,0.82)"
        strokeWidth="10"
      />

      <path
        d="M251 126c31-24 78-38 129-38s98 14 129 38c24 19 40 46 46 78 8 38 9 76 2 114-11 58-35 108-82 138-22 14-57 23-95 23s-73-9-95-23c-47-30-71-80-82-138-7-38-6-76 2-114 6-32 22-59 46-78Z"
        fill={`url(#${skullWindow})`}
        fillOpacity="0.92"
        stroke="rgba(118,132,145,0.16)"
        strokeWidth="2"
      />

      <path
        d="M258 187c-26 7-46 33-46 64 0 22 10 42 27 55-6 11-9 23-9 36 0 41 34 75 75 75 19 0 37-7 50-19 6 30 26 53 55 53 29 0 49-23 55-53 13 12 31 19 50 19 41 0 75-34 75-75 0-13-3-25-9-36 17-13 27-33 27-55 0-31-20-57-46-64-7-44-40-79-88-79-26 0-47 10-64 29-17-19-38-29-64-29-48 0-81 35-88 79Z"
        fill={`url(#${brainFill})`}
        fillOpacity="0.96"
        stroke="rgba(255,248,238,0.92)"
        strokeWidth="10"
      />

      <path
        d="M380 144v253"
        stroke="#FFF9EE"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <path
        d="M323 165c-32 12-53 41-53 75 0 12 3 24 9 35-19 9-32 29-32 52 0 22 13 42 32 52M437 165c32 12 53 41 53 75 0 12-3 24-9 35 19 9 32 29 32 52 0 22-13 42-32 52"
        stroke="#FFF8EA"
        strokeLinecap="round"
        strokeWidth="11"
      />
      <path
        d="M303 231c18 5 31 17 38 35M293 300c21 4 36 17 43 35M457 231c-18 5-31 17-38 35M467 300c-21 4-36 17-43 35"
        stroke="#FFF3E5"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M380 398c0 22-7 40-25 58"
        stroke="#F5A38F"
        strokeLinecap="round"
        strokeWidth="10"
      />
      <path
        d="M380 398c0 22 7 40 25 58"
        stroke="#F5A38F"
        strokeLinecap="round"
        strokeWidth="10"
      />

      <path
        d="M287 446c-10 28-36 46-68 46M473 446c10 28 36 46 68 46"
        stroke="#EEDCC9"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <path
        d="M308 481c21 15 46 23 72 23s51-8 72-23"
        stroke="#E9D5C1"
        strokeLinecap="round"
        strokeWidth="14"
      />

      <circle cx="273" cy="153" r="9" fill="#FFF8EA" fillOpacity="0.84" />
      <circle cx="487" cy="153" r="9" fill="#FFF8EA" fillOpacity="0.84" />
      <circle cx="227" cy="374" r="10" fill="#FFF8EA" fillOpacity="0.62" />
      <circle cx="533" cy="374" r="10" fill="#FFF8EA" fillOpacity="0.62" />
    </svg>
  );
}

export function BrainGraphic({
  variant = "profile-cutaway",
  className = "brainGraphic",
  cropPreset = "top-60",
}: BrainGraphicProps) {
  const idPrefix = useId().replace(/:/g, "");

  switch (variant) {
    case "organic":
      return <OrganicGraphic className={className} idPrefix={idPrefix} />;
    case "frontal-cutaway":
      return <FrontalCutawayGraphic className={className} idPrefix={idPrefix} />;
    case "profile-cutaway":
    default:
      return <ProfileCutawayGraphic className={className} cropPreset={cropPreset} />;
  }
}
