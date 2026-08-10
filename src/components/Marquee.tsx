const WORDS = ["MUNDËSI", "MIQËSI", "UDHËTIME", "SHTËPI", "NDARJE", "SWIPE MODE"];

// Pure CSS scroll animation — Server Component, no JS shipped.
export default function Marquee() {
  const items = [...WORDS, ...WORDS]; // duplicated for a seamless loop

  return (
    <div
      className="relative z-10 overflow-hidden border-y-[3px] border-black py-3"
      style={{ background: "#d4ff3d", transform: "rotate(-1deg)", margin: "8px 0 -8px" }}
    >
      <div className="marquee-track">
        {items.map((word, i) => (
          <span className="marquee-item" key={i}>
            {word}
            <span className="sep">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
