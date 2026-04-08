export function BrainGraphic() {
  return (
    <svg
      aria-hidden="true"
      className="brainGraphic"
      viewBox="0 0 760 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="headGlow" x1="178" y1="76" x2="554" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff3df" />
          <stop offset="1" stopColor="#d6f3ea" />
        </linearGradient>
        <linearGradient id="brainFill" x1="253" y1="122" x2="493" y2="391" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9d76" />
          <stop offset="0.52" stopColor="#f26d8a" />
          <stop offset="1" stopColor="#ffcf78" />
        </linearGradient>
        <linearGradient id="brainStroke" x1="207" y1="137" x2="544" y2="379" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffdca8" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      <path
        d="M488.1 63.4c65 19.9 111.9 79 116.2 148.8 39.8 41.1 60.8 95.2 55 150.5-8.8 85.9-80.1 150-166.6 150H316.6c-97.4 0-177.8-72.4-190.4-168.1-8.1-61.3 12.9-118.9 54.8-160C189.7 103.9 257 47.3 336 47.3c19 0 37.5 3.3 54.7 9.4 31.1-6.4 64.6-4.6 97.4 6.7Z"
        fill="url(#headGlow)"
        fillOpacity="0.72"
      />

      <path
        d="M265.6 436.9c-50.1-20-86.4-67.7-86.4-123.8 0-41 19.4-77.3 49.5-100.5-2.2-8-3.4-16.5-3.4-25.2 0-53.4 43.2-96.6 96.6-96.6 20.6 0 39.8 6.4 55.6 17.4 13.8-8.2 29.8-12.9 46.8-12.9 40.7 0 75.7 26.7 87.8 63.5 41.6 8.8 72.9 45.7 72.9 89.8 0 20.6-6.8 39.6-18.4 54.8 8.4 15.6 13.1 33.5 13.1 52.4 0 60.9-49.4 110.3-110.3 110.3H265.6Z"
        fill="url(#brainFill)"
        fillOpacity="0.92"
        stroke="url(#brainStroke)"
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
