"use client";
import { useState, useRef } from "react";

export default function RemoverFondoTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  };

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      setStatus("Descargando modelo de IA (solo la primera vez)...");
      const { removeBackground } = await import("@imgly/background-removal");
      setStatus("Eliminando fondo...");
      const blob = await removeBackground(file);
      setResult(URL.createObjectURL(blob));
      setStatus("");
    } catch (e) {
      setStatus("Error al procesar. Intenta con otra imagen.");
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-700">
        🤖 Usa IA para eliminar el fondo automáticamente. Funciona en tu navegador, sin subir imágenes a ningún servidor.
        <br />⚠️ La primera vez descarga el modelo (~50MB). Después es instantáneo.
      </div>

      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">✂️</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu imagen aquí</p>
          <p className="text-gray-400 text-sm mb-4">JPG, PNG, WebP — la IA eliminará el fondo</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">
            Seleccionar imagen
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">🖼️</span>
            <p className="font-medium text-gray-800 text-sm truncate flex-1">{file.name}</p>
            <button onClick={() => { setFile(null); setPreview(null); setResult(null); }}
              className="text-gray-400 hover:text-red-500">✕</button>
          </div>

          {/* Preview grid */}
          <div className={`grid gap-4 ${result ? "grid-cols-2" : "grid-cols-1"}`}>
            {preview && (
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Original</p>
                <img src={preview} alt="original" className="w-full rounded-xl max-h-56 object-contain bg-gray-100" />
              </div>
            )}
            {result && (
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Sin fondo ✅</p>
                <img src={result} alt="sin fondo"
                  className="w-full rounded-xl max-h-56 object-contain"
                  style={{ background: "repeating-conic-gradient(#d1d5db 0% 25%, white 0% 50%) 0 0 / 16px 16px" }} />
              </div>
            )}
          </div>

          {loading && (
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="animate-spin text-3xl mb-2">⚙️</div>
              <p className="text-sm text-purple-700 font-medium">{status}</p>
            </div>
          )}

          {!loading && !result && (
            <button onClick={process} className="btn-primary w-full py-3 rounded-xl font-bold">
              ✂️ Eliminar fondo con IA
            </button>
          )}

          {result && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
              <p className="font-medium text-purple-800">✅ Fondo eliminado — PNG transparente listo</p>
              <div className="flex gap-3">
                <a href={result} download={`sin-fondo_${file.name.replace(/\.[^.]+$/, "")}.png`}
                  className="btn-primary flex-1 text-center py-2 rounded-xl font-medium text-sm">
                  ⬇️ Descargar PNG
                </a>
                <button onClick={() => { setResult(null); setLoading(false); }}
                  className="flex-1 py-2 rounded-xl font-medium text-sm border-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                  🔄 Otra imagen
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
