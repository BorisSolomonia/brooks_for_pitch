import { useEffect, useRef } from "react";

export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 60 + 30;
      data[i] = v;
      data[i + 1] = v * 0.85;
      data[i + 2] = v * 0.65;
      data[i + 3] = Math.random() * 40 + 10;
    }

    ctx.putImageData(imageData, 0, 0);
    const url = canvas.toDataURL("image/png");
    el.style.backgroundImage = `url(${url})`;
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: "var(--grain-opacity, 0.30)" as string,
        backgroundRepeat: "repeat",
        mixBlendMode: "multiply",
      }}
    />
  );
}
