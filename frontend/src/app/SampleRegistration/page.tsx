"use client"

import { useState } from 'react';
import Image from 'next/image';
import PhotoSelector from '@/components/PhotoSelector';

export default function PhotoRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');

  const handlePhotoSelect = (imageData: string) => {
    setSelectedImage(imageData);
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedImage) return;
      const base64Response = await fetch(selectedImage);
      const blob = await base64Response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');
      formData.append('name', photoName);

      const response = await fetch('http://localhost:8000/api/photos/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error submitting photo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4">
        <header className="bg-blue-200 p-4 mb-4 rounded-t-lg">
          <h1 className="text-center text-lg">おかたづけチェッカー</h1>
        </header>

        {/* Step 1: 写真選択画面 */}
        {currentStep === 1 && (
          <PhotoSelector 
            onPhotoSelect={handlePhotoSelect}
            onCancel={() => {
              setSelectedImage(null);
              setCurrentStep(1);
            }}
          />
        )}

        {/* Step 3: 名前入力画面 */}
        {currentStep === 3 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="aspect-square bg-gray-200 mb-4 flex items-center justify-center">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Selected photo"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={photoName}
                onChange={(e) => setPhotoName(e.target.value)}
                placeholder="名前を付けて保存"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSubmit}
                className="w-full py-2 bg-blue-200 rounded"
              >
                保存
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 完了画面 */}
        {currentStep === 4 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-center text-xl">登録できました！</p>
          </div>
        )}
      </div>
    </div>
  );
}