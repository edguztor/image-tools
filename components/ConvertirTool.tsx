"use client";
import { useState, useRef } from "react";

type Format = "image/jpeg" | "image/png" | "image/webp";
const FORMATS: { label: string; value: Format; ext: string }[] = [
  { label: "JPG", value: "image/jpeg", ext: "jpg" },
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

export default function ConvertirTool() {
  const [targetFormat, setTargetFormat] = useState<Format>("image/webp");
  const [results, setResults] = useState<{ name: string; url: string; ext: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (files: FileList) => {
    setLoading(true); setResults([]);
    const ext = FORMATS.find(f => f.value === targetFormat)!.ext;
    const out: { name: string; url: string; ext: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const url = await new Promise<string>(res => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          if (targetFormat === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
          ctx.drawImage(img, 0, 0);
          res(canvas.toDataURL(targetFormat, 0.92));
        };
        img.src = URL.createObjectURL(file);
      });
      out.push({ name: file.name.replace(/\.[^.]+$/, ""), url, ext });
    }
    setResults(out); setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 self-center">Convertir a:</span>
        {FORMATS.map(f => (
          <button key={f.value} onClick={() => setTargetFormat(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${targetFormat === f.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-blue-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className={`drop-zone rounded-2xl p-10 text-center cursor-pointer ${dragging ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) convert(e.dataTransfer.files); }}>
        <div className="text-5xl mb-3">🔄</div>
        <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra imágenes aquí</p>
        <p className="text-gray-400 text-sm mb-4">Convierte múltiples imágenes a la vez</p>
        <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imágenes</button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) convert(e.target.files); }} />
      </div>

      {loading && <div className="text-center py-6 text-blue-600 font-medium animate-pulse">⏳ Convirtiendo...</div>}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((r, i) => (
            <a key={i} href={r.url} download={`${r.name}.${r.ext}`}
              className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 hover:bg-blue-100 transition-colors">
              <img src={r.url} alt={r.name} className="w-12 h-12 object-cover rounded-lg border border-blue-200" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 text-sm truncate">{r.name}.{r.ext}</p>
                <p className="text-xs text-blue-600">⬇️ Descargar</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
