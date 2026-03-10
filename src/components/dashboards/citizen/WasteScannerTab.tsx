import React, { useRef, useState } from 'react';
import { Camera, Upload, ScanLine, RotateCcw, Recycle, Trash2, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface WasteClassification {
  wasteType: string;
  category: 'Dry Waste' | 'Wet Waste' | 'Hazardous Waste' | 'Sanitary Waste' | 'E-Waste' | 'Unknown';
  bin: string;
  binColor: string;
  recyclable: boolean;
  instructions: string;
  confidence: number;
}

const CATEGORY_META: Record<string, { emoji: string; bg: string; border: string; text: string }> = {
  'Dry Waste':      { emoji: '📦', bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700'  },
  'Wet Waste':      { emoji: '🥬', bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700' },
  'Hazardous Waste':{ emoji: '☣️', bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700'   },
  'Sanitary Waste': { emoji: '🗑️', bg: 'bg-gray-50',   border: 'border-gray-300',  text: 'text-gray-700'  },
  'E-Waste':        { emoji: '🔋', bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700' },
  'Unknown':        { emoji: '❓', bg: 'bg-gray-50',   border: 'border-gray-200',  text: 'text-gray-600'  },
};

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WasteScannerTab() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<WasteClassification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError('');
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));
    setLoading(true);
    try {
      const imageBase64 = await toBase64(file);
      const mimeType = file.type || 'image/jpeg';
      const apiBase = (import.meta.env.VITE_API_BASE_URL as string) ?? '';
      const res = await fetch(`${apiBase}/api/classify-waste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: WasteClassification = await res.json();
      setResult(data);
    } catch (err: any) {
      setError('Could not classify this image. Please try again with a clearer photo.');
      console.error('[WasteScanner]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const openCamera = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await CapCamera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });
        if (image.webPath) {
          const blob = await (await fetch(image.webPath)).blob();
          processFile(new File([blob], 'waste.jpg', { type: 'image/jpeg' }));
        }
      } catch { /* user cancelled */ }
    } else {
      cameraRef.current?.click();
    }
  };

  const openGallery = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await CapCamera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos,
        });
        if (image.webPath) {
          const blob = await (await fetch(image.webPath)).blob();
          processFile(new File([blob], 'waste.jpg', { type: 'image/jpeg' }));
        }
      } catch { /* user cancelled */ }
    } else {
      galleryRef.current?.click();
    }
  };

  const reset = () => {
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  const meta = result ? (CATEGORY_META[result.category] ?? CATEGORY_META['Unknown']) : null;

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-emerald-600" />
          Waste Scanner
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Take or upload a photo of any waste item to instantly learn how to dispose of it correctly.
        </p>
      </div>

      {/* Capture area */}
      {!previewUrl ? (
        <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 bg-emerald-50 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">Scan a waste item</p>
            <p className="text-xs text-gray-500 mt-1">Point your camera at any waste — plastic, food, batteries, electronics…</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={openCamera}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
            >
              <Camera className="w-4 h-4" />
              Camera
            </button>
            <button
              onClick={openGallery}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Gallery
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <img src={previewUrl} alt="Waste item" className="w-full max-h-64 object-cover" />
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin border-[3px]" />
              <p className="text-white text-sm font-medium">Analysing waste…</p>
            </div>
          )}
          <button
            onClick={reset}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

      {/* Hidden inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileInput} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Result card */}
      {result && meta && (
        <div className={`rounded-2xl border-2 p-5 space-y-4 ${meta.bg} ${meta.border}`}>
          {/* Category badge + waste type */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Identified as</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{result.wasteType}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${meta.bg} ${meta.text} border ${meta.border}`}>
              <span>{meta.emoji}</span>
              {result.category}
            </span>
          </div>

          {/* Bin */}
          <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: result.binColor }} />
            <div>
              <p className="text-xs text-gray-500 font-medium">Dispose in</p>
              <p className="font-bold text-gray-900">{result.bin}</p>
            </div>
          </div>

          {/* Recyclable */}
          <div className="flex items-center gap-2">
            {result.recyclable ? (
              <>
                <Recycle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Recyclable</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-600">Not recyclable</span>
              </>
            )}
            {result.confidence >= 0.8 ? (
              <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> High confidence
              </span>
            ) : result.confidence >= 0.5 ? (
              <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Zap className="w-3.5 h-3.5" /> Moderate confidence
              </span>
            ) : (
              <span className="ml-auto flex items-center gap-1 text-xs text-red-500 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Low confidence
              </span>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">How to dispose</p>
            <p className="text-sm text-gray-800">{result.instructions}</p>
          </div>

          {/* Scan again */}
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ScanLine className="w-4 h-4" />
            Scan another item
          </button>
        </div>
      )}

      {/* Bin reference guide */}
      {!result && !loading && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Bin Reference</p>
          <div className="space-y-2">
            {[
              { color: '#3B82F6', label: 'Blue Bin',  desc: 'Dry Waste — plastic, paper, metal, glass' },
              { color: '#22C55E', label: 'Green Bin', desc: 'Wet Waste — food scraps, organic' },
              { color: '#EF4444', label: 'Red Bin',   desc: 'Hazardous — batteries, medicines, chemicals' },
              { color: '#374151', label: 'Black Bin', desc: 'Sanitary — diapers, bandages' },
              { color: '#F59E0B', label: 'E-Waste',   desc: 'Electronics — phones, chargers, cables' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                <span className="text-sm font-semibold text-gray-700 w-24">{b.label}</span>
                <span className="text-xs text-gray-500">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
