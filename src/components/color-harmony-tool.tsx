"use client";

import { useState, useCallback, useMemo } from "react";
import { Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ToolEvents } from "@/lib/analytics";

// ─── Color Math ────────────────────────────────────────────────────────────

interface HSL {
  h: number; // 0–360
  s: number; // 0–100
  l: number; // 0–100
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function shiftHue(hsl: HSL, degrees: number): HSL {
  return { ...hsl, h: (hsl.h + degrees + 360) % 360 };
}

function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// ─── Harmony Schemes ───────────────────────────────────────────────────────

interface ColorSwatch {
  hex: string;
  hsl: HSL;
  label: string;
}

interface HarmonyScheme {
  id: string;
  name: string;
  description: string;
  colors: ColorSwatch[];
}

function buildSchemes(baseHsl: HSL): HarmonyScheme[] {
  const h = (hue: number, label: string): ColorSwatch => {
    const hsl = shiftHue(baseHsl, hue);
    return { hex: hslToHex(hsl), hsl, label };
  };

  return [
    {
      id: "complementary",
      name: "Complementary",
      description: "Two colors directly opposite on the color wheel (180° apart). High contrast, vibrant.",
      colors: [
        h(0, "Base"),
        h(180, "Complement"),
      ],
    },
    {
      id: "triadic",
      name: "Triadic",
      description: "Three colors equally spaced 120° apart. Vibrant and balanced.",
      colors: [
        h(0, "Base"),
        h(120, "Triad 2"),
        h(240, "Triad 3"),
      ],
    },
    {
      id: "analogous",
      name: "Analogous",
      description: "Three adjacent colors, each 30° apart. Harmonious and natural-looking.",
      colors: [
        h(-30, "Analog 1"),
        h(0, "Base"),
        h(30, "Analog 2"),
      ],
    },
    {
      id: "split-complementary",
      name: "Split Complementary",
      description: "Base color plus the two colors adjacent to its complement. Softer contrast than complementary.",
      colors: [
        h(0, "Base"),
        h(150, "Split 1"),
        h(210, "Split 2"),
      ],
    },
    {
      id: "tetradic",
      name: "Tetradic",
      description: "Four colors forming two complementary pairs, 90° apart. Rich variety.",
      colors: [
        h(0, "Base"),
        h(90, "Tetrad 2"),
        h(180, "Tetrad 3"),
        h(270, "Tetrad 4"),
      ],
    },
    {
      id: "monochromatic",
      name: "Monochromatic",
      description: "Same hue, different lightness levels. Cohesive and elegant.",
      colors: [
        { hex: hslToHex({ ...baseHsl, l: 20 }), hsl: { ...baseHsl, l: 20 }, label: "Darkest" },
        { hex: hslToHex({ ...baseHsl, l: 40 }), hsl: { ...baseHsl, l: 40 }, label: "Dark" },
        { hex: hslToHex({ ...baseHsl, l: 55 }), hsl: { ...baseHsl, l: 55 }, label: "Base" },
        { hex: hslToHex({ ...baseHsl, l: 70 }), hsl: { ...baseHsl, l: 70 }, label: "Light" },
        { hex: hslToHex({ ...baseHsl, l: 85 }), hsl: { ...baseHsl, l: 85 }, label: "Lightest" },
      ],
    },
  ];
}

// ─── Swatch ────────────────────────────────────────────────────────────────

function Swatch({ swatch, onCopy }: { swatch: ColorSwatch; onCopy: (v: string) => void }) {
  const { hex, hsl } = swatch;
  const rgb = hslToRgb(hsl);
  const textColor = hsl.l > 55 ? "#000000" : "#ffffff";

  return (
    <div className="flex flex-col gap-1">
      <button
        title={`Click to copy ${hex}`}
        onClick={() => onCopy(hex)}
        style={{ backgroundColor: hex }}
        className="h-16 w-full rounded-xl border border-black/10 hover:scale-105 transition-transform cursor-pointer flex items-end p-2"
      >
        <span style={{ color: textColor }} className="text-xs font-mono font-semibold leading-none opacity-80">
          {hex.toUpperCase()}
        </span>
      </button>
      <p className="text-xs text-muted-foreground text-center">{swatch.label}</p>
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => onCopy(hex.toUpperCase())}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          title="Copy HEX"
        >HEX</button>
        <span className="text-muted-foreground/40">·</span>
        <button
          onClick={() => onCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          title="Copy HSL"
        >HSL</button>
        <span className="text-muted-foreground/40">·</span>
        <button
          onClick={() => onCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          title="Copy RGB"
        >RGB</button>
      </div>
    </div>
  );
}

// ─── Main Tool ─────────────────────────────────────────────────────────────

const DEFAULT_COLOR = "#ec4899";

export function ColorHarmonyTool() {
  const [input, setInput] = useState(DEFAULT_COLOR);
  const [activeHex, setActiveHex] = useState(DEFAULT_COLOR);
  const [activeScheme, setActiveScheme] = useState("complementary");

  const baseHsl = useMemo(() => {
    const rgb = hexToRgb(activeHex);
    if (!rgb) return null;
    return rgbToHsl(rgb);
  }, [activeHex]);

  const schemes = useMemo(() => {
    if (!baseHsl) return [];
    return buildSchemes(baseHsl);
  }, [baseHsl]);

  const currentScheme = schemes.find((s) => s.id === activeScheme) ?? schemes[0];

  const handleHexInput = useCallback((val: string) => {
    setInput(val);
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      setActiveHex(clean.toLowerCase());
      ToolEvents.toolUsed("hex-input");
    }
  }, []);

  const handleColorPicker = useCallback((val: string) => {
    setInput(val);
    setActiveHex(val.toLowerCase());
    ToolEvents.toolUsed("color-picker");
  }, []);

  const copyValue = useCallback((val: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`Copied: ${val}`);
    ToolEvents.resultCopied();
  }, []);

  const exportCSS = useCallback(() => {
    if (!currentScheme) return;
    const vars = currentScheme.colors
      .map((c, i) => `  --harmony-${i + 1}: ${c.hex.toUpperCase()};  /* ${c.label} */`)
      .join("\n");
    const css = `:root {\n  /* ${currentScheme.name} scheme — base ${activeHex.toUpperCase()} */\n${vars}\n}`;
    navigator.clipboard.writeText(css);
    toast.success("CSS variables copied!");
    ToolEvents.resultExported("css");
  }, [currentScheme, activeHex]);

  const exportTailwind = useCallback(() => {
    if (!currentScheme) return;
    const entries = currentScheme.colors
      .map((c, i) => `    "harmony-${i + 1}": "${c.hex.toUpperCase()}",  // ${c.label}`)
      .join("\n");
    const config = `// tailwind.config.js — extend.colors\n// ${currentScheme.name} scheme — base ${activeHex.toUpperCase()}\n{\n${entries}\n}`;
    navigator.clipboard.writeText(config);
    toast.success("Tailwind config copied!");
    ToolEvents.resultExported("tailwind");
  }, [currentScheme, activeHex]);

  if (!baseHsl) return null;

  return (
    <div className="space-y-8">
      {/* Color Picker Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-3">
          <label htmlFor="color-picker" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Base Color
          </label>
          <div className="relative">
            <input
              id="color-picker"
              type="color"
              value={activeHex}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="h-10 w-10 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
              title="Pick a color"
            />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => handleHexInput(e.target.value)}
            placeholder="#ec4899"
            maxLength={7}
            className="w-32 font-mono text-sm px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">
            HSL({baseHsl.h}, {baseHsl.s}%, {baseHsl.l}%)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyValue(`hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`)}
            className="h-7 w-7 p-0"
            title="Copy HSL"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Scheme Tabs */}
      <div className="flex flex-wrap gap-2">
        {schemes.map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => setActiveScheme(scheme.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              activeScheme === scheme.id
                ? "bg-gradient-to-r from-brand to-brand-accent text-white border-transparent shadow-sm"
                : "border-border text-muted-foreground hover:text-foreground hover:border-brand/40"
            }`}
          >
            {scheme.name}
          </button>
        ))}
      </div>

      {/* Active Scheme */}
      {currentScheme && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{currentScheme.name}</h3>
                <Badge variant="secondary">{currentScheme.colors.length} colors</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{currentScheme.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={exportCSS} className="gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                CSS
              </Button>
              <Button variant="outline" size="sm" onClick={exportTailwind} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Tailwind
              </Button>
            </div>
          </div>

          <div
            className={`grid gap-3 ${
              currentScheme.colors.length === 2
                ? "grid-cols-2"
                : currentScheme.colors.length === 3
                ? "grid-cols-3"
                : currentScheme.colors.length === 4
                ? "grid-cols-4"
                : "grid-cols-5"
            }`}
          >
            {currentScheme.colors.map((swatch) => (
              <Swatch key={swatch.label} swatch={swatch} onCopy={copyValue} />
            ))}
          </div>
        </div>
      )}

      {/* All Schemes Preview */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">All Schemes at a Glance</p>
        <div className="space-y-2">
          {schemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setActiveScheme(scheme.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-brand/40 hover:bg-muted/30 transition-colors text-left"
            >
              <span className="text-sm font-medium w-44 shrink-0">{scheme.name}</span>
              <div className="flex gap-1.5 flex-1">
                {scheme.colors.map((c) => (
                  <div
                    key={c.label}
                    style={{ backgroundColor: c.hex }}
                    className="h-6 flex-1 rounded-md border border-black/10"
                    title={c.hex}
                  />
                ))}
              </div>
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
