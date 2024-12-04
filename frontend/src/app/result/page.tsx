'use client'

export default function Analysis() {
  return (
    <div className="bg-[url('/back-img/clean-room.jpg')] h-screen bg-cover bg-center flex flex-col">
      {/* 仮ヘッダー */}
      {/* <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>仮ヘッダー</p>
        </div>
      </header> */}

      {/* メインコンテンツ */}
      <main className="flex-grow container mx-auto px-10 py-8 flex justify-center items-center">
        <div className="flex flex-col">
          <img src="/back-img/spankle.png" alt="aa" />
          <div className="bg-white rounded-lg p-8 max-w-xl w-full">
            <p className="text-center text-lg font-semibold text-[#DAA520]">お片付けの達人！</p>
            <p className="text-center text-lg font-semibold text-[#DAA520]">
              部屋がキラキラ！今日も最高の片付けマスター！
            </p>
          </div>
          <div className="flex justify-between mt-6">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
              閉じる
            </button>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
              知らせる
            </button>
          </div>
        </div>
      </main>

      {/* 仮フッター */}
      {/* <footer className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>仮フッター</p>
        </div>
      </footer> */}
    </div>
  )
}