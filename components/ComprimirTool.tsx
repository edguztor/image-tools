"use client";
import { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";

interface Result { name: string; original: number; compressed: number; url: string; }

export default function ComprimirTool() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(80);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList) => {
    setLoading(true); setResults([]);
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const out: Result[] = [];
    for (const file of arr) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 10,
          initialQuality: quality / 100,
          useWebWorker: true,
          preserveExif: false,
        });
        out.push({
          name: file.name,
          original: file.size,
          compressed: compressed.size,
          url: URL.createObjectURL(compressed),
        });
      } catch { /* skip */ }
    }
    setResults(out); setLoading(false);
  }, [quality]);

  const fmt = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-medium text-gray-700">Calidad: {quality}%</label>
        <input type="range" min={20} max={95} value={quality} onChange={e => setQuality(Number(e.target.value))}
          className="flex-1 min-w-32 accent-purple-600" />
      </div>

      <div className={`drop-zone rounded-2xl p-10 text-center cursor-pointer ${dragging ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files); }}>
        <div className="text-5xl mb-3">🗜️</div>
        <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra imágenes aquí</p>
        <p className="text-gray-400 text-sm mb-4">JPG, PNG, WebP — múltiples archivos a la vez</p>
        <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imágenes</button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) processFiles(e.target.files); }} />
      </div>

      {loading && <div className="text-center py-6 text-purple-600 font-medium animate-pulse">⏳ Comprimiendo...</div>}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => {
            const pct = Math.round((1 - r.compressed / r.original) * 100);
            return (
              <div key={i} className="flex items-center justify-between bg-purple-50 rounded-xl p-4 gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 text-sm truncate">{r.name}</p>
                  <p className="text-xs text-gray-500">{fmt(r.original)} → {fmt(r.compressed)}
                    <span className="ml-2 text-green-600 font-bold">−{pct}%</span>
                  </p>
                </div>
                <a href={r.url} download={`comprimido_${r.name}`}
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                  ⬇️ Descargar
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
