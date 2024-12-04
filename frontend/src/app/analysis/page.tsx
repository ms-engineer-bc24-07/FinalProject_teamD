'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"

export default function Analysis() {
  return (
    <div className="flex flex-col h-screen">
      {/* 仮ヘッダー */}
      {/* <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>仮ヘッダー</p>
        </div>
      </header> */}

      {/* メインコンテンツ */}
      <div className="mx-auto px-4 py-8">
        <p className="text-center">バックエンド処理中ここにインジケーター出したい</p>
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src="/testimages/reference.jpg" srcSet="" alt="Image one" />}
          itemTwo={<ReactCompareSliderImage src="/testimages/current.jpg" srcSet="" alt="Image two" />}
        />
      </div>

      {/* 仮フッター */}
      {/* <footer className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>仮フッター</p>
        </div>
      </footer> */}
    </div>
  )
}