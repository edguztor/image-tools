"use client";
import { useState, useRef } from "react";

export default function RotarTool() {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [result, setResult] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name); setResult(""); setRotation(0); setFlipH(false); setFlipV(false);
    setPreview(URL.createObjectURL(file));
  };

  const apply = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const rad = rotation * Math.PI / 180;
    const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
    const cw = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
    const ch = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);
    const c = document.createElement("canvas");
    c.width = cw; c.height = ch;
    const ctx = c.getContext("2d")!;
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    setResult(c.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">↻</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra una imagen aquí</p>
          <p className="text-gray-400 text-sm mb-4">Rota o voltea tu imagen</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imagen</button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <img ref={imgRef} src={preview} alt="preview"
              className="max-h-48 mx-auto rounded-xl border border-gray-200 object-contain transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }} />
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => setRotation(r => (r - 90 + 360) % 360)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-purple-400">↺ −90°</button>
            <button onClick={() => setRotation(r => (r + 90) % 360)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-purple-400">↻ +90°</button>
            <button onClick={() => setRotation(r => (r + 180) % 360)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-purple-400">↕ 180°</button>
            <button onClick={() => setFlipH(v => !v)}
              className={`px-4 py-2 rounded-xl border font-medium ${flipH ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-300 text-gray-700"} hover:border-purple-400`}>
              ↔ Voltear H
            </button>
            <button onClick={() => setFlipV(v => !v)}
              className={`px-4 py-2 rounded-xl border font-medium ${flipV ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-300 text-gray-700"} hover:border-purple-400`}>
              ↕ Voltear V
            </button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={apply} className="btn-primary flex-1 py-2 rounded-xl font-medium text-sm">✅ Aplicar y descargar</button>
            <button onClick={() => { setPreview(""); setResult(""); }} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">Otra imagen</button>
          </div>

          {result && (
            <a href={result} download={`${fileName.replace(/\.[^.]+$/, "")}_rotada.jpg`}
              className="flex items-center gap-3 bg-violet-50 rounded-xl p-3 hover:bg-violet-100 transition-colors">
              <img src={result} alt="result" className="w-16 h-16 object-contain rounded-lg border border-violet-200" />
              <span className="font-medium text-violet-700">⬇️ Descargar imagen editada</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
