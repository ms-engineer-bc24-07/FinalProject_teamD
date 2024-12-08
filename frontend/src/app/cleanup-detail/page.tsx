'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/Header';  // Headerをインポート
import Footer from '../../components/Footer';  // Footerをインポート

const CleanupDetailPage = () => {
  const router = useRouter();
  const { recordId } = router.query;
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (recordId) {
      axios.get(`/api/comparison-images/${recordId}`)
        .then(response => setRecord(response.data))
        .catch(error => console.error("Error fetching record:", error));
    }
  }, [recordId]);

  if (!record) return <div>Loading...</div>;

  return (
    <div>
      <Header />  {/* ヘッダーを追加 */}
      <h1>{record.user.user_name} の片付け記録</h1>
      <img src={record.image_url} alt="Record Image" />
      <p>スコア: {record.score}</p>
      <Footer />  {/* フッターを追加 */}
    </div>
  );
};

export default CleanupDetailPage;
