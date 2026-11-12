// Decorative, authored UI illustrations. These are category symbols, not
// catalog photographs or assertions about hardware in the collection.
export function HardwareArt({
  kind,
}: {
  kind: "console" | "game" | "accessory";
}) {
  if (kind === "game")
    return (
      <svg viewBox="0 0 120 80" className="hardware-art" aria-hidden="true">
        <g transform="rotate(-9 60 40)">
          <path
            d="M23 10h74v60H23z"
            fill="#b4a1ba"
            stroke="#26172b"
            strokeWidth="3"
          />
          <path d="M28 10h64v10H28z" fill="#ddd1df" />
          <path d="M34 26h52v29H34z" rx="4" fill="#58234f" />
          <path d="M38 30h44v21H38z" fill="#b84672" />
          <path
            d="m41 46 12-12 10 9 8-7 9 10"
            fill="none"
            stroke="#ffbe68"
            strokeWidth="4"
          />
          <path d="M35 61h50" stroke="#66516d" strokeWidth="4" />
          <path d="M20 23h6v37h-6M94 23h6v37h-6" fill="#8e7c99" />
        </g>
      </svg>
    );
  if (kind === "accessory")
    return (
      <svg viewBox="0 0 120 80" className="hardware-art" aria-hidden="true">
        <g transform="rotate(9 60 40)">
          <path
            d="M39 6h44v63c0 7-6 9-13 9H39z"
            fill="#d8d3cf"
            stroke="#352431"
            strokeWidth="2.5"
          />
          <path d="M44 12h34v28H44z" fill="#7c7b6c" />
          <path d="M49 16h24v18H49z" fill="#acc653" />
          <path d="M48 48h15v5H48zM53 43h5v15h-5z" fill="#3a3341" />
          <circle cx="74" cy="48" r="4" fill="#d93069" />
          <circle cx="66" cy="55" r="4" fill="#d93069" />
          <path d="m60 67 5-2m2 4 5-2" stroke="#817886" strokeWidth="2.5" />
          <path d="m76 66 3-1m-3 5 3-1" stroke="#817886" />
        </g>
      </svg>
    );
  return (
    <svg viewBox="0 0 120 80" className="hardware-art" aria-hidden="true">
      <g transform="rotate(-12 60 40)">
        <path
          d="M28 18h62c13 0 23 11 23 24 0 17-18 26-30 16L72 50H48L36 59C20 70 6 56 8 42c1-14 7-24 20-24z"
          fill="#bcb4cd"
          stroke="#312237"
          strokeWidth="3"
        />
        <path d="M28 23h57c9 0 17 7 18 16H18c1-8 4-16 10-16z" fill="#e2ddea" />
        <circle cx="30" cy="40" r="13" fill="#a49bb1" />
        <path d="M19 37h22v7H19zM27 30h7v22h-7z" fill="#3b3447" />
        <ellipse cx="85" cy="39" rx="18" ry="13" fill="#a19ab3" />
        <circle cx="91" cy="32" r="5" fill="#b063c5" />
        <circle cx="80" cy="39" r="5" fill="#9974d7" />
        <circle cx="94" cy="44" r="5" fill="#e97da4" />
        <circle cx="63" cy="38" r="3" fill="#6c627d" />
        <path d="m49 43 6-2m2 5 6-2" stroke="#54465f" strokeWidth="3" />
      </g>
    </svg>
  );
}
