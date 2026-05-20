import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://image-tools-gratis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ImagenGratis — Herramientas de Imagen Online 100% Gratuitas",
    template: "%s | ImagenGratis",
  },
  description:
    "Comprime, convierte, redimensiona y edita imágenes gratis online. JPG, PNG, WebP, HEIC. Sin registro, sin límites. Todo en tu navegador.",
  keywords: [
    "comprimir imagen gratis", "convertir jpg a png", "convertir a webp",
    "redimensionar imagen online", "recortar imagen gratis", "convertir heic a jpg",
    "marca de agua imagen", "rotar imagen gratis", "herramientas imagen online",
  ],
  authors: [{ name: "ImagenGratis" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "ImagenGratis — Herramientas de Imagen Online Gratuitas",
    description: "Comprime, convierte y edita imágenes gratis. Sin registro. 100% en tu navegador.",
    type: "website",
    url: siteUrl,
    siteName: "ImagenGratis",
    locale: "es_MX",
  },
  verification: {},
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8285676413297966"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">🖼️</span>
              <span style={{ color: "var(--primary)" }}>Imagen</span>
              <span className="text-gray-800">Gratis</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
              <Link href="/comprimir"  className="hover:text-purple-600 transition-colors">Comprimir</Link>
              <Link href="/convertir"  className="hover:text-purple-600 transition-colors">Convertir</Link>
              <Link href="/webp"       className="hover:text-purple-600 transition-colors">→WebP</Link>
              <Link href="/heic"       className="hover:text-purple-600 transition-colors">HEIC→JPG</Link>
              <Link href="/redimensionar" className="hover:text-purple-600 transition-colors">Redimensionar</Link>
              <Link href="/recortar"   className="hover:text-purple-600 transition-colors">Recortar</Link>
              <Link href="/rotar"      className="hover:text-purple-600 transition-colors">Rotar</Link>
              <Link href="/marca-agua" className="hover:text-purple-600 transition-colors">Marca agua</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-semibold text-white">ImagenGratis</p>
                <p className="text-sm text-gray-400">Herramientas de imagen 100% gratuitas. Tu privacidad protegida.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/comprimir"     className="hover:text-white transition-colors">Comprimir</Link>
                <Link href="/convertir"     className="hover:text-white transition-colors">Convertir</Link>
                <Link href="/webp"          className="hover:text-white transition-colors">Convertir a WebP</Link>
                <Link href="/heic"          className="hover:text-white transition-colors">HEIC a JPG</Link>
                <Link href="/redimensionar" className="hover:text-white transition-colors">Redimensionar</Link>
                <Link href="/recortar"      className="hover:text-white transition-colors">Recortar</Link>
                <Link href="/rotar"         className="hover:text-white transition-colors">Rotar</Link>
                <Link href="/marca-agua"    className="hover:text-white transition-colors">Marca de agua</Link>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} ImagenGratis. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
