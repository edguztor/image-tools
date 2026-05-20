"use client";
import { useState, useRef } from "react";

export default function HeicTool() {
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (files: FileList) => {
    setLoading(true); setResults([]); setError("");
    try {
      const heic2any = (await import("heic2any")).default;
      const out: { name: string; url: string }[] = [];
      for (const file of Array.from(files)) {
        const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 }) as Blob;
        out.push({ name: file.name.replace(/\.(heic|heif)$/i, ""), url: URL.createObjectURL(blob) });
      }
      setResults(out);
    } catch {
      setError("No se pudo convertir. Asegúrate de subir archivos HEIC o HEIF.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
        📱 Ideal para fotos de iPhone. Convierte archivos <strong>.heic</strong> y <strong>.heif</strong> a JPG.
      </div>

      <div className={`drop-zone rounded-2xl p-10 text-center cursor-pointer ${dragging ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) convert(e.dataTransfer.files); }}>
        <div className="text-5xl mb-3">📱</div>
        <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra fotos HEIC aquí</p>
        <p className="text-gray-400 text-sm mb-4">Convierte fotos de iPhone/iPad a JPG</p>
        <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar archivos HEIC</button>
        <input ref={inputRef} type="file" accept=".heic,.heif,image/heic,image/heif" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) convert(e.target.files); }} />
      </div>

      {loading && <div className="text-center py-6 text-orange-600 font-medium animate-pulse">⏳ Convirtiendo HEIC a JPG...</div>}
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {results.map((r, i) => (
            <a key={i} href={r.url} download={`${r.name}.jpg`}
              className="group block rounded-xl overflow-hidden border border-orange-200 hover:border-orange-400 transition-colors relative">
              <img src={r.url} alt={r.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-orange-500 px-2 py-1 rounded-full">⬇️ JPG</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
