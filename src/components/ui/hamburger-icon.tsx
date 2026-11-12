/**
 * Geometry and motion matched to Danyal Asif's Framer Hamburger Menu preview:
 * https://www.framer.com/marketplace/components/hamburger-menu/
 * The containing Radix control owns interaction and accessible state.
 */
export function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="44"
      height="44"
      className="hamburger-icon size-11"
      data-state={open ? "open" : "closed"}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <path
        data-hamburger-line="outer"
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        strokeDasharray={open ? "20 300" : "12 63"}
        strokeDashoffset={open ? -32.42 : 0}
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}
