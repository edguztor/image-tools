"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

// 👉 Reemplaza este valor con tu Slot ID real de AdSense
//    AdSense → Anuncios → Por unidad de anuncio → Anuncios display → copia el data-ad-slot
const AD_SLOT = "7687220224";
import ComprimirTool from "@/components/ComprimirTool";
import ConvertirTool from "@/components/ConvertirTool";
import WebpTool from "@/components/WebpTool";
import HeicTool from "@/components/HeicTool";
import RedimensionarTool from "@/components/RedimensionarTool";
import RecortarTool from "@/components/RecortarTool";
import RotarTool from "@/components/RotarTool";
import MarcaAguaTool from "@/components/MarcaAguaTool";

const tools = [
  { id: "comprimir",     icon: "🗜️", label: "Comprimir",       desc: "Reduce el peso de JPG, PNG y WebP",     color: "#7c3aed", bg: "bg-purple-50",  border: "border-purple-200" },
  { id: "convertir",     icon: "🔄", label: "Convertir",        desc: "JPG↔PNG↔WebP y más formatos",           color: "#2563eb", bg: "bg-blue-50",    border: "border-blue-200" },
  { id: "webp",          icon: "⚡", label: "→ WebP",           desc: "Convierte cualquier imagen a WebP",     color: "#0891b2", bg: "bg-cyan-50",    border: "border-cyan-200" },
  { id: "heic",          icon: "📱", label: "HEIC → JPG",       desc: "Convierte fotos de iPhone a JPG",       color: "#ea580c", bg: "bg-orange-50",  border: "border-orange-200" },
  { id: "redimensionar", icon: "📐", label: "Redimensionar",    desc: "Cambia el tamaño en píxeles o %",       color: "#16a34a", bg: "bg-green-50",   border: "border-green-200" },
  { id: "recortar",      icon: "✂️", label: "Recortar",         desc: "Recorta la imagen a medida exacta",     color: "#dc2626", bg: "bg-red-50",     border: "border-red-200" },
  { id: "rotar",         icon: "↻",  label: "Rotar / Voltear",  desc: "Gira o voltea tu imagen fácilmente",   color: "#7c3aed", bg: "bg-violet-50",  border: "border-violet-200" },
  { id: "marca-agua",    icon: "💧", label: "Marca de Agua",    desc: "Añade texto o logo a tu imagen",        color: "#0d9488", bg: "bg-teal-50",    border: "border-teal-200" },
];

const toolComponents: Record<string, React.ReactNode> = {
  comprimir:     <ComprimirTool />,
  convertir:     <ConvertirTool />,
  webp:          <WebpTool />,
  heic:          <HeicTool />,
  redimensionar: <RedimensionarTool />,
  recortar:      <RecortarTool />,
  rotar:         <RotarTool />,
  "marca-agua":  <MarcaAguaTool />,
};

export default function Home() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const toolRef = useRef<HTMLDivElement>(null);

  const selectTool = (id: string) => {
    setActiveTool(id);
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const active = tools.find(t => t.id === activeTool);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Herramientas de Imagen{" "}
          <span style={{ color: "var(--primary)" }}>100% Gratis</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Comprime, convierte, redimensiona y edita imágenes directamente en tu navegador.
          Sin registro. Sin límites. Tus archivos nunca salen de tu dispositivo.
        </p>
      </div>

      {/* Anuncio superior */}
      <AdBanner slot={AD_SLOT} format="horizontal" className="mb-8 rounded-xl overflow-hidden min-h-[90px] bg-gray-50" />

      {/* Grid de herramientas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => selectTool(tool.id)}
            className={`tool-card rounded-2xl p-5 text-left border-2 transition-all ${tool.bg} ${
              activeTool === tool.id ? `${tool.border} shadow-md` : "border-transparent"
            }`}
          >
            <div className="text-3xl mb-2">{tool.icon}</div>
            <div className="font-bold text-gray-800 text-sm mb-1">{tool.label}</div>
            <div className="text-xs text-gray-500">{tool.desc}</div>
          </button>
        ))}
      </div>

      {/* Panel de herramienta activa */}
      {activeTool && active && (
        <div
          ref={toolRef}
          className="bg-white rounded-2xl border-2 shadow-sm p-6"
          style={{ borderColor: active.color }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{active.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{active.label}</h2>
              <p className="text-sm text-gray-500">{active.desc}</p>
            </div>
          </div>
          {toolComponents[activeTool]}
        </div>
      )}

      {/* Anuncio entre herramientas e info */}
      {!activeTool && (
        <AdBanner slot={AD_SLOT} format="rectangle" className="my-8 rounded-xl overflow-hidden min-h-[250px] bg-gray-50" />
      )}

      {/* Info SEO */}
      {!activeTool && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: "🔒", title: "100% Privado", desc: "Las imágenes se procesan en tu navegador. Nunca se suben a ningún servidor." },
            { icon: "⚡", title: "Ultra Rápido", desc: "Sin colas, sin esperas. Procesa tus imágenes al instante." },
            { icon: "💰", title: "Totalmente Gratis", desc: "Sin registro, sin suscripción, sin límite de archivos." },
          ].map(f => (
            <div key={f.title} className="bg-purple-50 rounded-2xl p-6">
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-bold text-gray-800 mb-1">{f.title}</div>
              <div className="text-sm text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
