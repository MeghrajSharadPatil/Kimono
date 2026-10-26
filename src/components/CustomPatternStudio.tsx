import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles, Upload } from 'lucide-react';
import { TRADITIONAL_SWATCHES } from '../data/kimonoData';
import { soundFX } from '../utils/soundEffects';

interface CustomPatternStudioProps {
  onApplyPattern: (dataUrl: string) => void;
  currentCustomPatternUrl: string | null;
}

type ToolMode = 'sakura_stamp' | 'tsuru_stamp' | 'nami_stamp' | 'brush';

export const CustomPatternStudio: React.FC<CustomPatternStudioProps> = ({
  onApplyPattern,
  currentCustomPatternUrl,
}) => {
  const padRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolMode>('sakura_stamp');
  const [strokeColor, setStrokeColor] = useState<string>('#C82846');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = padRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentCustomPatternUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = currentCustomPatternUrl;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSakuraStamp(ctx, 64, 64, 22, '#E13D73');
      drawNamiStamp(ctx, 148, 148, 24, '#1D4E89');
      drawSakuraStamp(ctx, 152, 60, 16, '#D4AF37');
      drawSakuraStamp(ctx, 58, 152, 16, '#F48FB1');
    }
  }, []);

  const drawSakuraStamp = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-r * 0.55, -r * 0.65, -r * 0.24, -r);
      ctx.lineTo(0, -r * 0.8);
      ctx.lineTo(r * 0.24, -r);
      ctx.quadraticCurveTo(r * 0.55, -r * 0.65, 0, 0);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
    ctx.restore();
  };

  const drawTsuruStamp = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.3);
    ctx.quadraticCurveTo(0, r * 0.2, r * 0.75, r * 0.4);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.2, -r * 0.4, -r * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-r * 0.1, 0);
    ctx.quadraticCurveTo(r * 0.25, -r * 0.9, r * 0.85, -r * 0.65);
    ctx.quadraticCurveTo(r * 0.5, -r * 0.1, 0, r * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#D62828';
    ctx.beginPath();
    ctx.arc(-r * 0.45, -r * 0.32, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawNamiStamp = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    [r, r * 0.72, r * 0.44].forEach((rad, i) => {
      ctx.beginPath();
      ctx.arc(0, r * 0.25, rad, Math.PI, 0, false);
      ctx.strokeStyle = i % 2 === 0 ? color : '#D4AF37';
      ctx.lineWidth = 2.4;
      ctx.stroke();
    });
    ctx.restore();
  };

  const paintAtCoords = (clientX: number, clientY: number, isClickStamp = false) => {
    const canvas = padRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    const points = [
      [x, y],
      [canvas.width - x, y],
      [x, canvas.height - y],
      [canvas.width - x, canvas.height - y],
    ];

    points.forEach(([px, py]) => {
      if (tool === 'brush') {
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (isClickStamp) {
        if (tool === 'sakura_stamp') {
          drawSakuraStamp(ctx, px, py, 20, strokeColor);
        } else if (tool === 'tsuru_stamp') {
          drawTsuruStamp(ctx, px, py, 22, strokeColor);
        } else if (tool === 'nami_stamp') {
          drawNamiStamp(ctx, px, py, 22, strokeColor);
        }
      }
    });
  };

  const commitTileToKimono = () => {
    const canvas = padRef.current;
    if (!canvas) return;
    soundFX.playKotoPluck(3);
    onApplyPattern(canvas.toDataURL('image/png'));
  };

  const handleClear = () => {
    const canvas = padRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    soundFX.playKotoPluck(0);
    onApplyPattern(canvas.toDataURL('image/png'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const canvas = padRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              onApplyPattern(canvas.toDataURL('image/png'));
              soundFX.playSakuraFanfare();
            }
          };
          img.src = reader.result;
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-[#E8C5D2] bg-[#FFFBFD] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-[#23181C]">
            Draw or Upload Your Own Pattern
          </h4>
          <p className="text-xs text-[#6B4A56]">
            Click the box to stamp cute patterns or upload any picture from your device.
          </p>
        </div>
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8A8BA] bg-white hover:bg-[#FCECF0] text-xs font-medium text-[#23181C] cursor-pointer transition-colors whitespace-nowrap shrink-0">
          <Upload className="w-3.5 h-3.5 text-[#C82846]" />
          <span>Upload Picture</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            { id: 'sakura_stamp', label: 'Cherry Blossom Stamp' },
            { id: 'tsuru_stamp', label: 'Crane Stamp' },
            { id: 'nami_stamp', label: 'Wave Stamp' },
            { id: 'brush', label: 'Paint Brush' },
          ] as { id: ToolMode; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTool(t.id);
              soundFX.playKotoPluck(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              tool === t.id
                ? 'bg-[#C82846] text-white'
                : 'bg-[#FCECF0] text-[#5C3A47] hover:bg-[#F7D6E0]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center">
          <div className="relative rounded-xl border-2 border-dashed border-[#D88FA8] bg-[#FFF5F8] p-1.5">
            <canvas
              ref={padRef}
              width={216}
              height={216}
              onMouseDown={(e) => {
                setIsDrawing(true);
                paintAtCoords(e.clientX, e.clientY, true);
              }}
              onMouseMove={(e) => {
                if (!isDrawing) return;
                if (tool === 'brush') paintAtCoords(e.clientX, e.clientY, false);
              }}
              onMouseUp={() => {
                if (isDrawing) {
                  setIsDrawing(false);
                  commitTileToKimono();
                }
              }}
              onMouseLeave={() => {
                if (isDrawing) {
                  setIsDrawing(false);
                  commitTileToKimono();
                }
              }}
              className="w-[180px] h-[180px] rounded-lg cursor-crosshair bg-white/80 block"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="block text-xs font-medium text-[#5C3A47] mb-1.5">Pick Stamp Color</span>
            <div className="flex flex-wrap gap-1.5">
              {TRADITIONAL_SWATCHES.slice(0, 8).map((sw) => (
                <button
                  key={sw.hex}
                  type="button"
                  title={sw.name}
                  onClick={() => setStrokeColor(sw.hex)}
                  style={{ backgroundColor: sw.hex }}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    strokeColor === sw.hex
                      ? 'scale-110 ring-2 ring-[#C82846] border-white'
                      : 'border-black/15 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={commitTileToKimono}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#C82846] hover:bg-[#A91E39] text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Put on Kimono</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[#E2BDCB] bg-white hover:bg-[#FCECF0] text-xs font-medium text-[#5C3A47] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
