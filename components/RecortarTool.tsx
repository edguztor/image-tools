"use client";
import { useState, useRef, useCallback } from "react";

export default function RecortarTool() {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(200);
  const [h, setH] = useState(200);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name); setResult("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth); setOrigH(img.naturalHeight);
      setX(0); setY(0);
      setW(Math.min(400, img.naturalWidth));
      setH(Math.min(400, img.naturalHeight));
      setPreview(url);
    };
    img.src = url;
  };

  const crop = useCallback(() => {
    if (!imgRef.current) return;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d")!.drawImage(imgRef.current, x, y, w, h, 0, 0, w, h);
    setResult(c.toDataURL("image/jpeg", 0.92));
  }, [x, y, w, h]);

  const presets = [
    { label: "Cuadrado", w: 1000, h: 1000 },
    { label: "Instagram", w: 1080, h: 1080 },
    { label: "Banner 16:9", w: 1920, h: 1080 },
    { label: "Twitter", w: 1500, h: 500 },
  ];

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">✂️</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra una imagen aquí</p>
          <p className="text-gray-400 text-sm mb-4">Recorta a las dimensiones exactas que necesitas</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imagen</button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <img ref={imgRef} src={preview} alt="preview" className="max-h-48 mx-auto rounded-xl border border-gray-200 object-contain" />
          <p className="text-xs text-center text-gray-400">Original: {origW} × {origH} px</p>

          <div className="flex gap-2 flex-wrap">
            {presets.map(p => (
              <button key={p.label} onClick={() => { setX(0); setY(0); setW(Math.min(p.w, origW)); setH(Math.min(p.h, origH)); }}
                className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:border-red-400 text-gray-600">{p.label}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[["X (inicio)", x, setX], ["Y (inicio)", y, setY], ["Ancho", w, setW], ["Alto", h, setH]].map(([label, val, setter]) => (
              <div key={label as string}>
                <label className="text-xs text-gray-600">{label as string} (px)</label>
                <input type="number" value={val as number} min={0}
                  onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mt-1" />
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={crop} className="btn-primary px-6 py-2 rounded-xl font-medium text-sm">✂️ Recortar</button>
            <button onClick={() => { setPreview(""); setResult(""); }} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">Otra imagen</button>
          </div>

          {result && (
            <div className="flex items-center gap-4 bg-red-50 rounded-xl p-4">
              <img src={result} alt="cropped" className="w-20 h-20 object-contain rounded-lg border border-red-200" />
              <div>
                <p className="font-medium text-gray-800 text-sm">{w} × {h} px</p>
                <a href={result} download={`${fileName.replace(/\.[^.]+$/, "")}_recortada.jpg`}
                  className="btn-primary mt-2 inline-block px-4 py-2 rounded-lg text-sm font-medium">⬇️ Descargar</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
