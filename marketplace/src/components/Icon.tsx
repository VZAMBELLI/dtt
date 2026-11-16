const P: Record<string, string> = {
  camera: "M3 7h4l2-2h6l2 2h4v12H3z M12 10a3 3 0 1 0 0 6a3 3 0 0 0 0-6z",
  lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4 M12 15v2",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z",
  safe: "M4 4h16v16H4z M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0z M12 9v-1 M6 20v1 M18 20v1",
  scan: "M4 8V4h4 M16 4h4v4 M20 16v4h-4 M8 20H4v-4 M7 12h10",
  alert: "M12 3l9 16H3z M12 10v4 M12 17v.5",
  target: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10z M12 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2z",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9c-4.6-.8-8-4.5-8-9V6z M9 12l2 2l4-4",
  doc: "M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h5",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13z M15.5 15.5L20 20",
  code: "M8 8l-4 4l4 4 M16 8l4 4l-4 4 M13 6l-2 12",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5 M8 7h7",
  terminal: "M3 5h18v14H3z M7 10l3 2l-3 2 M12 15h5",
  user: "M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8z M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5",
  box: "M3 7l9-4l9 4v10l-9 4l-9-4z M3 7l9 4l9-4 M12 11v10",
  bolt: "M13 3L5 13h6l-1 8l8-10h-6z",
  cart: "M3 4h2l2.5 11h11L21 7H6.5 M9 19.5a1 1 0 1 0 0 .1 M17 19.5a1 1 0 1 0 0 .1",
  check: "M5 12l4 4L19 6",
  store: "M4 9l1.5-5h13L20 9 M4 9v11h16V9 M4 9h16 M9 20v-6h6v6",
  arrow: "M5 12h14 M13 6l6 6l-6 6",
  eye: "M2 12s3.5-7 10-7s10 7 10 7s-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z"
};
export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={P[name] ?? P.box} />
    </svg>
  );
}
export const TYPE_ICON: Record<string, string> = { PHYSICAL: "box", SERVICE: "target", DIGITAL: "code", PROFESSIONAL: "user" };
