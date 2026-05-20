"use client";
import { useState, useRef } from "react";

export default function RedimensionarTool() {
  const [preview, setPreview] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name); setResult("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth); setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth); setHeight(img.naturalHeight);
      setPreview(url);
    };
    img.src = url;
  };

  const updateW = (v: number) => {
    setWidth(v);
    if (lock && origW) setHeight(Math.round(v * origH / origW));
  };
  const updateH = (v: number) => {
    setHeight(v);
    if (lock && origH) setWidth(Math.round(v * origW / origH));
  };

  const resize = () => {
    if (!imgRef.current) return;
    const c = document.createElement("canvas");
    c.width = width; c.height = height;
    const ctx = c.getContext("2d")!;
    if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height); }
    ctx.drawImage(imgRef.current, 0, 0, width, height);
    setResult(c.toDataURL(format, 0.92));
  };

  const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">📐</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra una imagen aquí</p>
          <p className="text-gray-400 text-sm mb-4">JPG, PNG, WebP</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imagen</button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <img ref={imgRef} src={preview} alt="preview" className="w-32 h-32 object-contain rounded-xl border border-gray-200" />
            <div className="flex-1 space-y-3 min-w-48">
              <p className="text-sm text-gray-500">Original: {origW} × {origH} px</p>
              <div className="flex items-center gap-2">
                <div>
                  <label className="text-xs text-gray-600">Ancho (px)</label>
                  <input type="number" value={width} onChange={e => updateW(Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm block mt-1" />
                </div>
                <button onClick={() => setLock(!lock)} className="mt-5 text-xl" title="Bloquear proporción">
                  {lock ? "🔒" : "🔓"}
                </button>
                <div>
                  <label className="text-xs text-gray-600">Alto (px)</label>
                  <input type="number" value={height} onChange={e => updateH(Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm block mt-1" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[25, 50, 75].map(p => (
                  <button key={p} onClick={() => { updateW(Math.round(origW * p / 100)); }}
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:border-purple-400 text-gray-600">{p}%</button>
                ))}
              </div>
              <select value={format} onChange={e => setFormat(e.target.value as typeof format)}
                className="text-sm border border-gray-300 rounded-lg px-2 py-1">
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={resize} className="btn-primary px-6 py-2 rounded-xl font-medium text-sm">📐 Redimensionar</button>
            <button onClick={() => { setPreview(""); setResult(""); }} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">Otra imagen</button>
          </div>

          {result && (
            <div className="flex items-center gap-4 bg-green-50 rounded-xl p-4">
              <img src={result} alt="result" className="w-20 h-20 object-contain rounded-lg border border-green-200" />
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{width} × {height} px</p>
                <a href={result} download={`${fileName.replace(/\.[^.]+$/, "")}_${width}x${height}.${ext}`}
                  className="btn-primary mt-2 inline-block px-4 py-2 rounded-lg text-sm font-medium">⬇️ Descargar</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
