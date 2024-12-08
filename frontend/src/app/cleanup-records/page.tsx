'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Header from '../../components/Header';  // Headerをインポート
import Footer from '../../components/Footer';  // Footerをインポート

const CleanupRecordsPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('/api/comparison-images')
      .then(response => setRecords(response.data))
      .catch(error => console.error("Error fetching records:", error));
  }, []);

  return (
    <div>
      <Header />  {/* ヘッダーを追加 */}
      <h1>過去の片付け記録</h1>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            <Link href={`/cleanup-detail/${record.id}`}>
              <div>
                <p>{record.user.user_name}</p>
                <p>{record.uploaded_at}</p>
                <img src={record.image_url} alt="Record Image" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Footer />  {/* フッターを追加 */}
    </div>
  );
};

export default CleanupRecordsPage;
