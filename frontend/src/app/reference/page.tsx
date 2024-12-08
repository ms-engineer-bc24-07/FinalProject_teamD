// "use client" を追加 
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';  // next/navigationからuseRouterをインポート
import Header from '../../components/Header';  // Headerをインポート
import Footer from '../../components/Footer';  // Footerをインポート

const ReferencePage = () => {
  const router = useRouter();  // next/navigation の useRouter を使用
  const pathname = usePathname(); // pathname を取得
  const searchParams = useSearchParams(); // searchParams を取得

  const referenceId = searchParams.get('referenceId'); // クエリパラメータを取得
  const [reference, setReference] = useState(null);

  useEffect(() => {
    if (referenceId) {
      axios.get(`http://localhost:8000/api/references/${referenceId}`)
        .then(response => setReference(response.data))
        .catch(error => console.error("Error fetching reference:", error));
    }
  }, [referenceId]);

  if (!reference) return <div>Loading...</div>;

  return (
    <div>
      <Header />  {/* ヘッダーを追加 */}
      <h1>{reference.reference_name}</h1>
      <img src={reference.image_url} alt="Reference Image" />
      
      {/* next/navigation の useRouter を使って遷移 */}
      <button onClick={() => router.push(`/cleanup-records/${referenceId}`)}>
        記録をみる
      </button>
      <button onClick={() => router.push(`/cleanup/${referenceId}`)}>
        片付け
      </button>

      <Footer />  {/* フッターを追加 */}
    </div>
  );
};

export default ReferencePage;
