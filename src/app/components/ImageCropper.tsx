"use client";
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  src: string;
  onCropComplete: (cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  }) => void;
  onCancel: () => void;
  initialAspectRatio?: number;
  initialCrop?: Crop;
  initialCropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  } | null;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ 
  src, 
  onCropComplete, 
  onCancel, 
  initialAspectRatio = 16/9,
  initialCrop,
  initialCropData 
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(initialAspectRatio);
  const [crop, setCrop] = useState<Crop>(initialCrop || {
    unit: '%',
    width: 90,
    height: 50,
    x: 5,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('🏗️ ImageCropper initialized with:', { 
    src, 
    initialCropData, 
    initialAspectRatio 
  });

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    console.log('🖼️ Image loaded. Size:', { width, height });
    console.log('🎯 Initial crop data:', initialCropData);
    
    // If we have initial crop data, convert it to percentage-based crop
    if (initialCropData && initialCropData.originalWidth && initialCropData.originalHeight) {
      const cropInPercent: Crop = {
        unit: '%',
        x: (initialCropData.x / initialCropData.originalWidth) * 100,
        y: (initialCropData.y / initialCropData.originalHeight) * 100,
        width: (initialCropData.width / initialCropData.originalWidth) * 100,
        height: (initialCropData.height / initialCropData.originalHeight) * 100,
      };
      console.log('🔄 Setting crop from initial data:', cropInPercent);
      setCrop(cropInPercent);
    } else if (aspectRatio) {
      const defaultCrop = centerAspectCrop(width, height, aspectRatio);
      console.log('🎨 Setting default crop:', defaultCrop);
      setCrop(defaultCrop);
    }
  }, [aspectRatio, initialCropData]);

  const getCroppedImg = useCallback(async (
    image: HTMLImageElement,
    crop: PixelCrop,
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', 0.95);
    });
  }, []);

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);
    try {
      const image = imgRef.current;
      const cropData = {
        x: completedCrop.x,
        y: completedCrop.y,
        width: completedCrop.width,
        height: completedCrop.height,
        originalWidth: image.naturalWidth,
        originalHeight: image.naturalHeight
      };
      onCropComplete(cropData);
    } catch (error) {
      console.error('Error processing crop:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">ویرایش تصویر</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop Area */}
        <div className="p-6 max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            minHeight={100}
            minWidth={100}
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop me"
              style={{ maxHeight: '50vh', maxWidth: '100%' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Aspect Ratio Controls */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نسبت تصویر
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (imgRef.current) {
                      const { width, height } = imgRef.current;
                      setAspectRatio(16/9);
                      setCrop(centerAspectCrop(width, height, 16/9));
                    }
                  }}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                >
                  16:9
                </button>
                <button
                  onClick={() => {
                    if (imgRef.current) {
                      const { width, height } = imgRef.current;
                      setAspectRatio(4/3);
                      setCrop(centerAspectCrop(width, height, 4/3));
                    }
                  }}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                >
                  4:3
                </button>
                <button
                  onClick={() => {
                    if (imgRef.current) {
                      const { width, height } = imgRef.current;
                      setAspectRatio(1);
                      setCrop(centerAspectCrop(width, height, 1));
                    }
                  }}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                >
                  1:1
                </button>
                <button
                  onClick={() => {
                    setAspectRatio(undefined);
                    setCrop({
                      unit: '%',
                      width: 90,
                      height: 90,
                      x: 5,
                      y: 5,
                    });
                  }}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                >
                  آزاد
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleCropComplete}
                disabled={!completedCrop || isProcessing}
                className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    در حال پردازش...
                  </>
                ) : (
                  'تأیید'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
