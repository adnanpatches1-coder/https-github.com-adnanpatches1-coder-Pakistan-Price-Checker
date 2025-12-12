import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Image as ImageIcon } from 'lucide-react';

interface ScannerProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError('Could not access camera. Please allow permissions or use upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        const rawBase64 = imageBase64.split(',')[1];
        onCapture(rawBase64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        onCapture(base64Data);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-20">
        <h2 className="text-white font-medium drop-shadow-md">Scan Product</h2>
        <button 
          onClick={() => { stopCamera(); onClose(); }} 
          className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden">
        {error ? (
          <div className="text-white text-center p-6 max-w-sm">
            <p className="mb-6 text-gray-300">{error}</p>
            <div className="flex gap-4 justify-center">
                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-emerald-600 rounded-full font-medium">Upload Photo</button>
                <button onClick={onClose} className="px-6 py-2 bg-gray-700 rounded-full font-medium">Close</button>
            </div>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            
            {/* Scan Overlay UI */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Scan Frame */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 border-2 border-emerald-500/50 rounded-xl overflow-hidden">
                 {/* Corner Markers */}
                 <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm"></div>
                 <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm"></div>
                 <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm"></div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-sm"></div>
                 
                 {/* Laser Scan Animation */}
                 <div className="absolute inset-x-0 h-0.5 bg-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,1)] animate-scan-line"></div>
                 
                 {/* Grid Overlay (Subtle) */}
                 <div className="w-full h-full opacity-10 bg-[linear-gradient(rgba(52,211,153,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.8)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              </div>
              
              <p className="mt-8 text-white/90 text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                Point at a product to identify
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-0 w-full pb-10 pt-16 flex justify-around items-center bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
        {/* Gallery Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all active:scale-95"
          title="Upload from Gallery"
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        {/* Capture Button */}
        {!error && (
            <button 
            onClick={handleCapture}
            className="w-20 h-20 bg-transparent rounded-full border-4 border-white/30 flex items-center justify-center hover:border-emerald-500/50 transition-all active:scale-90"
            >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                </div>
            </div>
            </button>
        )}

        {/* Placeholder for symmetry or future feature (e.g., flash toggle) */}
        <div className="w-14"></div> 
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload}
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scanLine 2s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
