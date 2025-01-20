import axios from "axios";

// グローバル設定
axios.defaults.withCredentials = true; // 認証情報（Cookie）を含める
axios.defaults.xsrfHeaderName = "X-CSRFToken"; // DjangoのCSRFトークンヘッダー名
axios.defaults.xsrfCookieName = "csrftoken"; // DjangoのCSRFトークンクッキー名

// ベースURLを設定（必要に応じて）
axios.defaults.baseURL = "http://localhost:8000";

export default axios;
