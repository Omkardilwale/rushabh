import { OrnamentSticker } from "./OrnamentStickers";

type RoyalDensity = "light" | "normal" | "rich";

interface RoyalBackgroundProps {
  density?: RoyalDensity;
  className?: string;
}

/**
 * Faint golden Rajput graphics for ivory / cream / white sections.
 * Keeps opacity low so content stays fully legible.
 */
export function RoyalBackground({
  density = "normal",
  className = "",
}: RoyalBackgroundProps) {
  const stickerOpacity =
    density === "light"
      ? "opacity-[0.09]"
      : density === "rich"
        ? "opacity-[0.14]"
        : "opacity-[0.11]";

  const jaliOpacity =
    density === "light" ? "opacity-[0.035]" : "opacity-[0.045]";

  return (
    <div
      className={`royal-bg pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className={`royal-bg__jali absolute inset-0 ${jaliOpacity}`} />

      <OrnamentSticker
        variant="jharokha"
        className={`royal-bg__float absolute -left-8 top-6 hidden sm:block ${stickerOpacity}`}
        size={density === "rich" ? 150 : 120}
      />
      <OrnamentSticker
        variant="jali"
        className={`royal-bg__float absolute right-2 top-1/4 ${stickerOpacity}`}
        size={density === "rich" ? 100 : 82}
        delay={1}
      />
      <OrnamentSticker
        variant="arch"
        className={`royal-bg__float absolute -right-6 bottom-20 hidden md:block ${stickerOpacity}`}
        size={88}
        delay={2}
      />
      <OrnamentSticker
        variant="lotus"
        className={`royal-bg__float absolute left-1/4 bottom-10 ${stickerOpacity}`}
        size={68}
        delay={0.5}
      />
      <OrnamentSticker
        variant="mandala"
        className={`royal-bg__float absolute right-1/3 top-10 hidden lg:block ${stickerOpacity}`}
        size={density === "rich" ? 140 : 110}
        delay={1.6}
      />

      {density !== "light" && (
        <>
          <OrnamentSticker
            variant="paisley"
            className={`royal-bg__float absolute left-10 top-1/2 hidden md:block ${stickerOpacity}`}
            size={72}
            delay={2.4}
          />
          <OrnamentSticker
            variant="ring"
            className={`royal-bg__float absolute bottom-6 right-1/4 hidden sm:block ${stickerOpacity}`}
            size={58}
            delay={3}
          />
          <OrnamentSticker
            variant="spark"
            className={`royal-bg__float absolute left-16 top-20 ${stickerOpacity}`}
            size={20}
            delay={0.8}
          />
          <OrnamentSticker
            variant="spark"
            className={`royal-bg__float absolute right-20 bottom-1/3 ${stickerOpacity}`}
            size={16}
            delay={1.2}
          />
        </>
      )}
    </div>
  );
}
