"use client";
import { useState, useRef } from "react";

export default function WebpTool() {
  const [results, setResults] = useState<{ name: string; url: string; original: number; compressed: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(85);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (files: FileList) => {
    setLoading(true); setResults([]);
    const out: { name: string; url: string; original: number; compressed: number }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await new Promise<string>(res => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext("2d")!.drawImage(img, 0, 0);
          res(c.toDataURL("image/webp", quality / 100));
        };
        img.src = URL.createObjectURL(file);
      });
      const blob = await fetch(dataUrl).then(r => r.blob());
      out.push({ name: file.name.replace(/\.[^.]+$/, ""), url: dataUrl, original: file.size, compressed: blob.size });
    }
    setResults(out); setLoading(false);
  };

  const fmt = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Calidad WebP: {quality}%</label>
        <input type="range" min={20} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))}
          className="flex-1 accent-cyan-600" />
      </div>

      <div className={`drop-zone rounded-2xl p-10 text-center cursor-pointer ${dragging ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) convert(e.dataTransfer.files); }}>
        <div className="text-5xl mb-3">⚡</div>
        <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra imágenes aquí</p>
        <p className="text-gray-400 text-sm mb-4">JPG, PNG, GIF → WebP (hasta 50% más pequeño)</p>
        <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imágenes</button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) convert(e.target.files); }} />
      </div>

      {loading && <div className="text-center py-6 text-cyan-600 font-medium animate-pulse">⏳ Convirtiendo a WebP...</div>}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => {
            const pct = Math.round((1 - r.compressed / r.original) * 100);
            return (
              <div key={i} className="flex items-center gap-3 bg-cyan-50 rounded-xl p-3 flex-wrap">
                <img src={r.url} alt={r.name} className="w-12 h-12 object-cover rounded-lg border border-cyan-200" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{r.name}.webp</p>
                  <p className="text-xs text-gray-500">{fmt(r.original)} → {fmt(r.compressed)}
                    <span className="ml-2 text-green-600 font-bold">−{pct > 0 ? pct : 0}%</span>
                  </p>
                </div>
                <a href={r.url} download={`${r.name}.webp`} className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">⬇️ WebP</a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
