"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * iOS 26 / Instagram маягийн Liquid Glass.
 * Арга барил: kube.io/blog/liquid-glass-css-svg —
 * rounded-rect-ийн ирмэгт **convex squircle гадаргуугийн профиль**
 * (Apple-ийн зөөлөн шилжилт) тавьж, түүний деривативаас (гадаргуугийн нормал)
 * хугарлыг тооцоолж displacement map (canvas) үүсгэнэ. Үүнийг feImage →
 * feDisplacementMap-аар backdrop-д хэрэглэнэ. Төв тунгалаг, ирмэгээр линз
 * шиг хугарал. Дээр нь CSS specular гэрэл + rim light.
 */
function makeDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bevel: number,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const cx = w / 2;
  const cy = h / 2;
  const halfX = w / 2;
  const halfY = h / 2;
  const r = Math.min(radius, halfX, halfY);
  const b = Math.min(bevel, halfX, halfY);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Rounded-rect SDF (< 0 дотор талд)
      const dxp = Math.abs(x + 0.5 - cx) - (halfX - r);
      const dyp = Math.abs(y + 0.5 - cy) - (halfY - r);
      const qx = Math.max(dxp, 0);
      const qy = Math.max(dyp, 0);
      const sdf = Math.hypot(qx, qy) + Math.min(Math.max(dxp, dyp), 0) - r;
      const dist = -sdf; // ирмэгээс дотогшхи зай (эерэг)

      let nx = 0;
      let ny = 0;
      if (dist >= 0 && dist < b) {
        // Гадагшаа нормал (хугарлын чиглэл)
        let gx = 0;
        let gy = 0;
        if (qx > 0 || qy > 0) {
          gx = Math.sign(x + 0.5 - cx) * qx;
          gy = Math.sign(y + 0.5 - cy) * qy;
        } else if (dxp > dyp) {
          gx = Math.sign(x + 0.5 - cx);
        } else {
          gy = Math.sign(y + 0.5 - cy);
        }
        const len = Math.hypot(gx, gy) || 1;
        gx /= len;
        gy /= len;
        // Convex squircle гадаргуу: y = (1 - (1-x)^4)^(1/4)
        // Хугарал = гадаргуугийн нормалын налуу (нэгж нормал → [0..1])
        const xn = dist / b; // 0 (ирмэг) .. 1 (дотор)
        const u = 1 - xn;
        const denom = Math.pow(1 - u * u * u * u, 0.75);
        const deriv = denom < 1e-4 ? 1e4 : (u * u * u) / denom;
        const mag = deriv / Math.sqrt(deriv * deriv + 1); // ирмэгт ≈1, төвд 0
        nx = gx * mag;
        ny = gy * mag;
      }

      const i = (y * w + x) * 4;
      data[i] = Math.round(128 + nx * 127);
      data[i + 1] = Math.round(128 + ny * 127);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

export function LiquidGlass({
  className,
  contentClassName,
  children,
  radius = 22,
  bevel = 16,
  scale = 24,
  blur = 5,
  solid = false,
}: {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  radius?: number;
  bevel?: number;
  scale?: number;
  blur?: number;
  solid?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<string | null>(null);
  const rawId = useId();
  const filterId = `lg-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const lastSize = useRef({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    lastSize.current = { w: 0, h: 0 }; // radius/bevel өөрчлөгдвөл дахин үүсгэнэ
    const gen = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 8 || h < 8) return;
      // Хэмжээ үнэхээр өөрчлөгдсөн үед л дахин үүсгэнэ (navigation flicker-ээс сэргийлнэ)
      if (w === lastSize.current.w && h === lastSize.current.h) return;
      lastSize.current = { w, h };
      setMap(makeDisplacementMap(w, h, radius, bevel));
    };
    gen();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(gen);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [radius, bevel]);

  return (
    <div
      ref={ref}
      className={cn("lg-root", className)}
      style={{ borderRadius: radius }}
    >
      {map && (
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              href={map}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}

      {/* Refraction давхарга */}
      <div
        className="lg-layer lg-refract"
        style={{
          borderRadius: radius,
          backdropFilter: map
            ? `blur(${blur}px) saturate(1.7) brightness(1.03) url(#${filterId})`
            : `blur(${blur + 2}px) saturate(1.7)`,
          WebkitBackdropFilter: `blur(${blur + 2}px) saturate(1.7)`,
        }}
      />
      {/* Өнгөний нимгэн tint */}
      <div
        className="lg-layer lg-tint"
        style={{ borderRadius: radius, opacity: solid ? 1 : 0.5 }}
      />
      {/* Specular гэрэл + ирмэг */}
      <div className="lg-layer lg-specular" style={{ borderRadius: radius }} />

      <div className={cn("lg-content", contentClassName)}>{children}</div>
    </div>
  );
}
