"use client"

import { useState } from 'react';

interface PhotoSelectorProps {
  onPhotoSelect: (imageData: string) => void;
  onCancel?: () => void;
  showConfirmation?: boolean;
}

export default function PhotoSelector({ 
  onPhotoSelect, 
  onCancel,
  showConfirmation = true 
}: PhotoSelectorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handlePhotoSelect = async (type: 'camera' | 'folder') => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      if (type === 'camera') {
        input.capture = 'environment';
      }
      
      input.onchange = function(event) {
        const target = event.target as HTMLInputElement
        if (target.files && target.files[0]) {
          const file = target.files[0]
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setSelectedImage(reader.result);
              if (showConfirmation) {
                setIsConfirming(true);
              } else {
                onPhotoSelect(reader.result);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      }
      input.click();
    } catch (error) {
      console.error('Error selecting photo:', error);
    }
  };

  if (isConfirming && selectedImage) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="aspect-square bg-gray-200 mb-4 flex items-center justify-center">
          <img
            src={selectedImage}
            alt="Selected photo"
            className="max-h-full object-containt-contain"
          />
        </div>
        <p className="text-center mb-4">この写真を登録しますか？</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onPhotoSelect(selectedImage)}
            className="w-full py-2 bg-blue-200 rounded"
          >
            登録
          </button>
          <button
            onClick={() => {
              setSelectedImage(null);
              setIsConfirming(false);
              onCancel?.();
            }}
            className="w-full py-2 bg-gray-200 rounded"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="aspect-square bg-gray-200 mb-4 flex items-center justify-center">
        <span className="text-gray-500">pic</span>
      </div>
      <div className="flex justify-around mt-4">
        <button
          onClick={() => handlePhotoSelect('folder')}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="写真を選択"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => handlePhotoSelect('camera')}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="カメラを起動"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}