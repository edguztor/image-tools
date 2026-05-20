"use client";
import { useState, useRef } from "react";

export default function MarcaAguaTool() {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("© Mi Marca");
  const [fontSize, setFontSize] = useState(40);
  const [opacity, setOpacity] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState("bottom-right");
  const [result, setResult] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name); setResult("");
    setPreview(URL.createObjectURL(file));
  };

  const apply = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = "alphabetic";
    const m = ctx.measureText(text);
    const pad = 20;
    const tw = m.width, th = fontSize;
    let x = pad, y = th + pad;
    if (position === "bottom-right") { x = c.width - tw - pad; y = c.height - pad; }
    if (position === "bottom-left") { x = pad; y = c.height - pad; }
    if (position === "top-right") { x = c.width - tw - pad; y = th + pad; }
    if (position === "center") { x = (c.width - tw) / 2; y = (c.height + th) / 2; }
    ctx.fillText(text, x, y);
    setResult(c.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">💧</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra una imagen aquí</p>
          <p className="text-gray-400 text-sm mb-4">Añade tu marca de agua o copyright</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar imagen</button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <img ref={imgRef} src={preview} alt="preview" className="max-h-40 mx-auto rounded-xl border border-gray-200 object-contain" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Texto de marca de agua</label>
              <input value={text} onChange={e => setText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Posición</label>
              <select value={position} onChange={e => setPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm mt-1">
                <option value="bottom-right">Abajo derecha</option>
                <option value="bottom-left">Abajo izquierda</option>
                <option value="top-right">Arriba derecha</option>
                <option value="top-left">Arriba izquierda</option>
                <option value="center">Centro</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Tamaño: {fontSize}px</label>
              <input type="range" min={12} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                className="w-full accent-teal-600 mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Opacidad: {opacity}%</label>
              <input type="range" min={10} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))}
                className="w-full accent-teal-600 mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-full h-9 border border-gray-300 rounded-lg mt-1 cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={apply} className="btn-primary flex-1 py-2 rounded-xl font-medium text-sm">💧 Aplicar marca de agua</button>
            <button onClick={() => { setPreview(""); setResult(""); }} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">Otra imagen</button>
          </div>

          {result && (
            <div className="flex items-center gap-4 bg-teal-50 rounded-xl p-4">
              <img src={result} alt="result" className="w-20 h-20 object-contain rounded-lg border border-teal-200" />
              <div>
                <p className="font-medium text-gray-800 text-sm">Marca de agua aplicada</p>
                <a href={result} download={`${fileName.replace(/\.[^.]+$/, "")}_watermark.jpg`}
                  className="btn-primary mt-2 inline-block px-4 py-2 rounded-lg text-sm font-medium">⬇️ Descargar</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
