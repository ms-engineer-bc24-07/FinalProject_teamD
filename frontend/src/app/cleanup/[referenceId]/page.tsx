'use client'

import { useState } from 'react';
import axios from "@/lib/axios";
import PhotoSelector from '@/components/PhotoSelector';
import { useParams, useRouter } from 'next/navigation';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { createImageFormData } from '@/utils/createImageData';
import { auth } from '@/lib/firebase';

interface FormError {
  message: string;
}

export default function PhotoRegistration() {
  const { referenceId } = useParams();  // useParamsでURLパラメータを取得
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [referenceImageURL, setReferenceImageURL] = useState<string | null>(null);
  const [error, setError] = useState<FormError | null>(null);
  const router = useRouter();

  const handlePhotoSelect = async (imageData: string) => {

    setSelectedImage(imageData);
    setError(null);

    try {
      // 見本画像を取得
      const referenceModel = await axios.get(`http://localhost:8000/api/references/${referenceId}/`);
      const referenceImgUrl = referenceModel.data.image_url;
      setReferenceImageURL(referenceImgUrl);

      // 見本画像と片付け実施画像をスライダーで比較できるコンポーネントを表示する
      setCurrentStep(3);

      const user = auth.currentUser;
      if (!user) {
        setError({ message: 'ログインしていません。' });
        return;
      }
      const idToken = await user.getIdToken();
      const firebaseUid = user.uid;
      
      const formData = await createImageFormData(imageData, firebaseUid, undefined, referenceModel.data.id)

      // 比較画像をS3にアップしてDBに登録
      const uploadResponse = await axios.post('http://localhost:8000/api/comparison-images/upload/', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`  // トークンをヘッダーに追加
        },
      });
      console.log('Success ComparisonImg:', uploadResponse.data);

      // スコアの計算とDB登録
      const scoreResponse = await axios.post('http://localhost:8000/api/scores/',
        {
          reference_image_url: referenceImgUrl,
          comparison_img_id: uploadResponse.data.id,
        }
      )
      console.log('Success Score:', scoreResponse.data.score);
      router.push("/result");
      
    } catch (error) {
      console.error("エラーが発生しました", error);
      setError({ message: 'スコア取得に失敗しました。もう一度試してください。' });
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* ヘッダー部分 */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-customBlue mr-12 transform transition-transform duration-150 active:scale-95 active:bg-customBlue-dark hover:text-customDarkblue"
        >
          ← 戻る
        </button>
        <h1 className="text-l font-bold text-customBlue text-center flex-grow">
          写真をアップロード
        </h1>
      </div>

      {/* エラーメッセージ表示を追加 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <p>{error.message}</p>
        </div>
      )}

      {/* Step 1.2: 写真選択画面 */}
      {currentStep === 1 && (
        <PhotoSelector
          onPhotoSelect={handlePhotoSelect}
          onCancel={() => {
            setSelectedImage(null);
            setCurrentStep(1);
          }}
        />
      )}

      {/* Step 3: 写真比較画面 */}
      {currentStep === 3 && selectedImage && referenceImageURL && (
        <div className="flex-grow p-5">
          <p className="text-center">バックエンド処理中ここにインジケーター出したい</p>
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={referenceImageURL} srcSet="" alt="Image one" />}
            itemTwo={<ReactCompareSliderImage src={selectedImage} srcSet="" alt="Image two" />}
          />
        </div>
      )}
    </div>
  );
}
