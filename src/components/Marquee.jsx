/**
 * Marquee — infinite horizontal scroller using a pure CSS animation.
 * The children are duplicated so the loop is seamless (translateX -50%).
 *
 * Props:
 *   items      — array of strings to render
 *   separator  — node rendered between items (default: a gold dot)
 *   className   — extra classes for each item's text
 *   duration   — animation duration in seconds (default 25s via tailwind)
 *   reverse    — scroll the other direction
 */
export default function Marquee({
  items = [],
  separator,
  className = "",
  duration,
  reverse = false,
}) {
  const sep = separator ?? (
    <span className="mx-6 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" />
  );

  // A single copy of the items, rendered as a row. Duplicated below for a
  // seamless loop (the animation translates by -50%).
  const track = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className={`flex items-center ${className}`}>
          <span>{item}</span>
          {sep}
        </span>
      ))}
    </div>
  );

  return (
    <div className="group relative flex w-full overflow-hidden">
      <div
        className="flex w-max animate-marquee"
        style={{
          animationDuration: duration ? `${duration}s` : undefined,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
