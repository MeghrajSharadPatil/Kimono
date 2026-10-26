import React, { useEffect, useState } from 'react';
import { MARIN_FULL_MODEL_URL, MARIN_HEADSHOT_URL } from '../assets/marinImages';
import { GarmentZone, KimonoConfig } from '../types/kimono';

interface KimonoModelCanvasProps {
  config: KimonoConfig;
  activeZone: GarmentZone;
  onSelectZone: (zone: GarmentZone) => void;
  onOpenFaceModal: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const KimonoModelCanvas: React.FC<KimonoModelCanvasProps> = ({
  config,
  activeZone,
  onSelectZone,
  onOpenFaceModal,
  canvasRef,
}) => {
  const [marinFullImg, setMarinFullImg] = useState<HTMLImageElement | null>(null);
  const [loadedFaceImg, setLoadedFaceImg] = useState<HTMLImageElement | null>(null);
  const [loadedCustomPatternImg, setLoadedCustomPatternImg] = useState<HTMLImageElement | null>(
    null
  );
  const [hoveredZone, setHoveredZone] = useState<GarmentZone | null>(null);

  // Load Marin Kitagawa full kimono anime illustration
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setMarinFullImg(img);
    img.src = MARIN_FULL_MODEL_URL;
  }, []);

  // Load user's AI-mapped face image
  useEffect(() => {
    if (!config.faceMapping.imageDataUrl) {
      setLoadedFaceImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLoadedFaceImg(img);
    img.src = config.faceMapping.imageDataUrl;
  }, [config.faceMapping.imageDataUrl]);

  // Load custom painted / uploaded pattern tile
  useEffect(() => {
    if (!config.customPatternDataUrl) {
      setLoadedCustomPatternImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLoadedCustomPatternImg(img);
    img.src = config.customPatternDataUrl;
  }, [config.customPatternDataUrl]);

  // Helper: 5-petal notched Sakura blossom
  const drawSakuraMotif = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    primary: string,
    secondary: string,
    goldLeaf: boolean
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-r * 0.58, -r * 0.62, -r * 0.24, -r);
      ctx.lineTo(0, -r * 0.8);
      ctx.lineTo(r * 0.24, -r);
      ctx.quadraticCurveTo(r * 0.58, -r * 0.62, 0, 0);
      ctx.fillStyle = primary;
      ctx.fill();
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = goldLeaf ? '#D4AF37' : '#F4B400';
    ctx.fill();
    ctx.restore();
  };

  // Helper: Red-Crowned Tsuru Crane
  const drawTsuruMotif = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    primary: string,
    secondary: string,
    goldLeaf: boolean
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = goldLeaf ? 'rgba(212, 175, 55, 0.65)' : secondary;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-r * 0.75, -r * 0.35);
    ctx.lineTo(-r * 0.45, -r * 0.3);
    ctx.quadraticCurveTo(-r * 0.2, 0, 0, r * 0.15);
    ctx.quadraticCurveTo(r * 0.35, r * 0.25, r * 0.65, r * 0.45);
    ctx.quadraticCurveTo(r * 0.25, -r * 0.05, -r * 0.35, -r * 0.35);
    ctx.closePath();
    ctx.fillStyle = primary || '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#1E161A';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-r * 0.05, 0);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.85, r * 0.85, -r * 0.65);
    ctx.quadraticCurveTo(r * 0.6, -r * 0.1, 0.1 * r, r * 0.12);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-r * 0.42, -r * 0.33, r * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#D62828';
    ctx.fill();
    ctx.restore();
  };

  // Helper: Nami Ocean Waves
  const drawNamiMotif = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    primary: string,
    secondary: string,
    goldLeaf: boolean
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    const radii = [r, r * 0.74, r * 0.48, r * 0.24];
    radii.forEach((rad, idx) => {
      ctx.beginPath();
      ctx.arc(0, r * 0.3, rad, Math.PI, 0, false);
      ctx.fillStyle = idx % 2 === 0 ? primary : secondary;
      ctx.fill();
      ctx.strokeStyle = goldLeaf ? '#D4AF37' : '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });
    ctx.restore();
  };

  // Helper: Convert normalized original image coords (ox, oy in 0..1) to canvas coords
  // Source crop is sx = 0.12 * imgW, sy = 0.01 * imgH, sw = 0.62 * imgW, sh = 0.98 * imgH
  const toCanvasPt = (ox: number, oy: number, W: number, H: number): [number, number] => {
    const u = (ox - 0.12) / 0.62;
    const v = (oy - 0.01) / 0.98;
    return [u * W, v * H];
  };

  const traceNormalizedPolygon = (
    ctx: CanvasRenderingContext2D,
    pts: Array<[number, number]>,
    W: number,
    H: number
  ) => {
    ctx.beginPath();
    pts.forEach(([ox, oy], idx) => {
      const [cx, cy] = toCanvasPt(ox, oy, W, H);
      if (idx === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.closePath();
  };

  // Precise polygons on Marin's kimono illustration:
  // 1. Main Kimono Body & Skirt (Migoro)
  const BODY_POLY: Array<[number, number]> = [
    [0.425, 0.245],
    [0.485, 0.285],
    [0.545, 0.245],
    [0.585, 0.275],
    [0.57, 0.335],
    [0.42, 0.335],
  ];
  const SKIRT_POLY: Array<[number, number]> = [
    [0.408, 0.435],
    [0.595, 0.435],
    [0.602, 0.905],
    [0.5, 0.916],
    [0.412, 0.902],
  ];

  // 2. Left & Right Flowing Sleeves (Sode)
  const LEFT_SLEEVE_POLY: Array<[number, number]> = [
    [0.395, 0.275],
    [0.415, 0.435],
    [0.398, 0.725],
    [0.325, 0.812],
    [0.296, 0.775],
    [0.305, 0.565],
    [0.345, 0.345],
  ];
  const RIGHT_SLEEVE_POLY: Array<[number, number]> = [
    [0.585, 0.268],
    [0.648, 0.365],
    [0.698, 0.485],
    [0.655, 0.508],
    [0.702, 0.775],
    [0.682, 0.822],
    [0.598, 0.715],
    [0.592, 0.44],
  ];

  // 3. Big Butterfly Obi Sash & Bow
  const OBI_POLY: Array<[number, number]> = [
    [0.415, 0.328],
    [0.585, 0.328],
    [0.648, 0.365],
    [0.625, 0.445],
    [0.645, 0.618],
    [0.582, 0.652],
    [0.488, 0.595],
    [0.495, 0.44],
    [0.415, 0.435],
  ];

  const renderPatternOverlayInClip = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number
  ) => {
    const step = 58;
    const motifRadius = 15 * config.patternScale;

    ctx.save();
    ctx.globalAlpha = 0.62;

    if (config.patternId === 'custom' && loadedCustomPatternImg) {
      const tileW = 84;
      const tileH = 84;
      for (let y = 140; y < H - 40; y += tileH) {
        for (let x = 60; x < W - 40; x += tileW) {
          ctx.drawImage(loadedCustomPatternImg, x, y, tileW, tileH);
        }
      }
    } else if (config.patternId === 'sakura_nami_ribbon') {
      for (let band = 2; band < 11; band++) {
        const yBase = band * 64;
        for (let x = 80; x < W - 60; x += 52) {
          const waveY = yBase + Math.sin(x * 0.03) * 14;
          if (band % 2 === 0) {
            drawSakuraMotif(
              ctx,
              x,
              waveY,
              motifRadius * 0.85,
              config.patternPrimaryColor,
              '#FFF5F8',
              config.goldLeafAccents
            );
          } else {
            drawNamiMotif(
              ctx,
              x,
              waveY,
              motifRadius * 0.9,
              config.patternSecondaryColor,
              '#85C1E9',
              config.goldLeafAccents
            );
          }
        }
      }
    } else {
      let row = 0;
      for (let y = 175; y < H - 55; y += step) {
        const offsetX = row % 2 === 0 ? 0 : step * 0.5;
        for (let x = 85 + offsetX; x < W - 65; x += step) {
          if (config.patternId === 'sakura') {
            drawSakuraMotif(
              ctx,
              x,
              y,
              motifRadius,
              config.patternPrimaryColor,
              config.patternSecondaryColor,
              config.goldLeafAccents
            );
          } else if (config.patternId === 'tsuru') {
            drawTsuruMotif(
              ctx,
              x,
              y,
              motifRadius * 1.15,
              config.patternPrimaryColor,
              config.patternSecondaryColor,
              config.goldLeafAccents
            );
          } else if (config.patternId === 'nami') {
            drawNamiMotif(
              ctx,
              x,
              y,
              motifRadius * 1.1,
              config.patternPrimaryColor,
              config.patternSecondaryColor,
              config.goldLeafAccents
            );
          }
        }
        row++;
      }
    }

    // Silk Texture Shimmer
    ctx.globalAlpha = 0.22;
    if (config.fabricTexture === 'nishijin') {
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1;
      for (let y = 160; y < H - 50; y += 6) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(W - 60, y);
        ctx.stroke();
      }
    } else if (config.fabricTexture === 'rinzu') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      for (let d = -200; d < W + 300; d += 22) {
        ctx.beginPath();
        ctx.moveTo(d, 160);
        ctx.lineTo(d - 220, H - 50);
        ctx.stroke();
      }
    } else if (config.fabricTexture === 'shibori') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.3;
      for (let y = 170; y < H - 60; y += 18) {
        for (let x = 75; x < W - 65; x += 18) {
          ctx.strokeRect(x, y, 5, 5);
        }
      }
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (marinFullImg) {
      // 1. Draw the exact Marin Kitagawa full kimono anime illustration (cleanly framed on Marin!)
      const sx = marinFullImg.width * 0.12;
      const sy = marinFullImg.height * 0.01;
      const sw = marinFullImg.width * 0.62;
      const sh = marinFullImg.height * 0.98;
      ctx.drawImage(marinFullImg, sx, sy, sw, sh, 0, 0, W, H);

      // 2. Apply Real-Time Dye Color & Pattern to Marin's Kimono Dress & Skirt
      ctx.save();
      ctx.beginPath();
      BODY_POLY.forEach(([ox, oy], idx) => {
        const [cx, cy] = toCanvasPt(ox, oy, W, H);
        if (idx === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      SKIRT_POLY.forEach(([ox, oy], idx) => {
        const [cx, cy] = toCanvasPt(ox, oy, W, H);
        if (idx === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.clip();

      // Multiply dye color so Marin's original anime linework and shading stay crisp
      ctx.globalCompositeOperation = 'multiply';
      const bodyGrad = ctx.createLinearGradient(0, H * 0.25, 0, H * 0.92);
      bodyGrad.addColorStop(0, config.baseColor);
      bodyGrad.addColorStop(0.7, config.baseColor);
      bodyGrad.addColorStop(1, config.hemGradientColor);
      ctx.fillStyle = bodyGrad;
      ctx.globalAlpha = 0.68;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'source-over';
      renderPatternOverlayInClip(ctx, W, H);
      ctx.restore();

      // 3. Apply Real-Time Dye Color & Pattern to Marin's Flowing Sleeves
      ctx.save();
      ctx.beginPath();
      LEFT_SLEEVE_POLY.forEach(([ox, oy], idx) => {
        const [cx, cy] = toCanvasPt(ox, oy, W, H);
        if (idx === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      RIGHT_SLEEVE_POLY.forEach(([ox, oy], idx) => {
        const [cx, cy] = toCanvasPt(ox, oy, W, H);
        if (idx === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.clip();

      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = config.sleeveColor;
      ctx.globalAlpha = 0.68;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'source-over';
      renderPatternOverlayInClip(ctx, W, H);
      ctx.restore();

      // 4. Apply Real-Time Dye Color to Marin's Butterfly Obi Sash & Bow
      ctx.save();
      traceNormalizedPolygon(ctx, OBI_POLY, W, H);
      ctx.clip();
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = config.obiColor;
      ctx.globalAlpha = 0.78;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = config.obiColor;
      ctx.globalAlpha = 0.38;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // 5. Highlight hovered zone with a gentle glowing outline
      if (hoveredZone === 'obi') {
        ctx.save();
        traceNormalizedPolygon(ctx, OBI_POLY, W, H);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      } else if (hoveredZone === 'migoro') {
        ctx.save();
        traceNormalizedPolygon(ctx, SKIRT_POLY, W, H);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // 6. Optional AI Face Swap Overlay on Marin's Face when enabled by user
      if (config.faceMapping.enabled && loadedFaceImg) {
        const [faceCx, faceCy] = toCanvasPt(0.495, 0.175, W, H);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(faceCx, faceCy, 34, 42, 0, 0, Math.PI * 2);
        ctx.clip();

        ctx.translate(
          faceCx + config.faceMapping.offsetX,
          faceCy + config.faceMapping.offsetY
        );
        ctx.rotate((config.faceMapping.rotation * Math.PI) / 180);
        const drawW = 78 * config.faceMapping.scale;
        const drawH = 92 * config.faceMapping.scale;
        ctx.drawImage(loadedFaceImg, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }
    } else {
      // Loading state while image loads
      ctx.fillStyle = '#FFF5F8';
      ctx.fillRect(0, 0, W, H);
    }
  }, [config, marinFullImg, loadedFaceImg, loadedCustomPatternImg, activeZone, hoveredZone]);

  const detectZoneFromCoords = (e: React.MouseEvent<HTMLCanvasElement>): GarmentZone => {
    const canvas = canvasRef.current;
    if (!canvas) return 'migoro';
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (y >= 0.08 && y <= 0.24 && x >= 0.45 && x <= 0.72) return 'face';
    if (y >= 0.31 && y <= 0.62 && x >= 0.45 && x <= 0.85) return 'obi';
    if (y >= 0.27 && (x < 0.45 || x > 0.76)) return 'sode';
    return 'migoro';
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative w-full max-w-[480px] rounded-3xl border-2 border-[#F0B8CC] bg-white p-2.5 sm:p-3 shadow-md">
        {/* Top Character Badge with Marin's Closeup Avatar */}
        <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5">
            <img
              src={MARIN_HEADSHOT_URL}
              alt="Marin Kitagawa"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#C82846]"
            />
            <div>
              <div className="text-sm font-bold text-[#23181C] leading-tight">
                Marin Kitagawa
              </div>
              <div className="text-[11px] text-[#8E244D]">
                Tap her dress, sleeves, or bow to style!
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenFaceModal}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#FCECF0] hover:bg-[#F7D4E0] active:scale-95 text-xs font-semibold text-[#C82846] transition-all whitespace-nowrap shrink-0"
          >
            {config.faceMapping.enabled ? 'Swap Back to Marin' : 'AI Face Swap'}
          </button>
        </div>

        {/* High-Resolution Interactive Marin Kimono Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-[#F2DCE4] bg-[#FFF5F8]">
          <canvas
            ref={canvasRef}
            width={520}
            height={720}
            onClick={(e) => {
              const zone = detectZoneFromCoords(e);
              onSelectZone(zone);
              if (zone === 'face') onOpenFaceModal();
            }}
            onMouseMove={(e) => setHoveredZone(detectZoneFromCoords(e))}
            onMouseLeave={() => setHoveredZone(null)}
            className="w-full h-auto cursor-pointer block touch-manipulation"
          />
        </div>

        {/* Mobile-Friendly Touch Part Selector Bar (Minimum 44px Touch Targets) */}
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {(
            [
              { id: 'migoro', label: 'Main Dress' },
              { id: 'sode', label: 'Sleeves' },
              { id: 'obi', label: 'Bow Belt' },
              { id: 'face', label: 'AI Face' },
            ] as { id: GarmentZone; label: string }[]
          ).map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => {
                onSelectZone(z.id);
                if (z.id === 'face') onOpenFaceModal();
              }}
              className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                activeZone === z.id
                  ? 'bg-[#C82846] text-white shadow-xs'
                  : 'bg-[#FFF5F8] border border-[#EBCAD7] text-[#5C3A47] hover:bg-[#FCECF0]'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
