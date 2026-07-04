// Custom inline SVG icons — 24px grid, 1.6px stroke, rounded caps, currentColor.
// Path data transcribed verbatim from the design prototype (no icon font, no emoji).

function Svg({ children, filled = false, sw = 1.6 }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const MusicIcon = () => (
  <Svg>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Svg>
);
export const PlayIcon = () => (
  <Svg filled>
    <path d="M8 5v14l11-7z" />
  </Svg>
);
export const DownloadIcon = () => (
  <Svg>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </Svg>
);
export const HeartIcon = () => (
  <Svg>
    <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z" />
  </Svg>
);
export const StarIcon = () => (
  <Svg filled>
    <path d="M12 2.5 14.9 8.6 21.5 9.5 16.7 14.2 17.9 20.8 12 17.7 6.1 20.8 7.3 14.2 2.5 9.5 9.1 8.6z" />
  </Svg>
);
export const QuoteIcon = () => (
  <Svg filled>
    <path d="M7 7c-2.2 0-4 1.8-4 4v6h6v-6H5c0-1.1.9-2 2-2V7zm10 0c-2.2 0-4 1.8-4 4v6h6v-6h-4c0-1.1.9-2 2-2V7z" />
  </Svg>
);
export const CalendarIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </Svg>
);
export const PinIcon = () => (
  <Svg>
    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);
export const ImageIcon = () => (
  <Svg>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="m4 18 5-5 4 4 3-3 4 4" />
  </Svg>
);
export const ArrowRightIcon = () => (
  <Svg>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);
export const ArrowLeftIcon = () => (
  <Svg>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Svg>
);
