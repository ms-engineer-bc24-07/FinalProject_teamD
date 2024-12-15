"use client"

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import PhotoSelector from '@/components/PhotoSelector';
import CustomButton from "../../components/CustomButton";


interface FormError {
  message:string;
}
export default function PhotoRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [error, setError] = useState<FormError | null>(null);

  const handlePhotoSelect = (imageData: string) => {
    setSelectedImage(imageData);
    setError(null);
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedImage || !photoName.trim()) {
      setError({ message: '画像と名前を入力してください' });
      return;
    }

    try {
      const base64Data = selectedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      
      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');
      formData.append('name', photoName);

      const response = await axios.post('http://localhost:8000/api/references/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Success:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        } else {
            console.error('Unknown Error:', error);
        }
    }
  }
  


  return (
    <div className="flex flex-col px-5 py-6">
      {/* エラーメッセージ表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <p>{error.message}</p>
        </div>
      )}

      {/* 写真選択画面 */}
      {currentStep === 1 && (
        <PhotoSelector
          onPhotoSelect={handlePhotoSelect}
          onCancel={() => {
            setSelectedImage(null);
            setCurrentStep(1);
          }}
        />
      )}

      {/* 名前入力画面 */}
      {currentStep === 3 && (
        <div className="bg-white p-4 rounded-lg shadow w-full max-w-md mx-auto">
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
          <div className="flex flex-col gap-2 items-center">
            <CustomButton text="保存" onClick={handleSubmit} />
          </div>
        </div>
      )}

      {/* 完了画面 */}
      {currentStep === 4 && (
        <div className="bg-white p-4 rounded-lg shadow w-full max-w-md mx-auto">
          <p className="text-center text-xl">登録できました！</p>
        </div>
      )}
    </div>
  );
};


