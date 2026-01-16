import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (!text) {
      setError('文章を入力してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');
  
    // 実際のアプリケーションでは、APIキーはサーバーサイドの環境変数から取得します。
    // これはあくまでフロントエンドでのデモのための記述です。
    const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;  // ここにあなたのAPIキーを入れます（非推奨）
    const API_URL = 'https://api.openai.com/v1/chat/completions';
  
    const prompt = `以下の文章を、重要なポイントを3つに絞って箇条書きで要約してください。\n\n${text}`;
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // 使用するモデル
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150, // 最大出力トークン数
          temperature: 0.5, // 出力の多様性（0に近いほど決定的）
        })
      });
  
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setSummary(data.choices[0].message.content.trim());
  
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI要約アプリ</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに要約したい文章を入力してください..."
      />
      <button onClick={handleSummarize} disabled={isLoading}>
        {isLoading ? '要約中...' : '要約する'}
      </button>
      {error && <div className="error">{error}</div>}
      {summary && (
        <div className="summary">
          <h2>要約結果：</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;