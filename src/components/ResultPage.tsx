import { useHistory } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore'; // clearAnswers を追加
import { calculateScores } from '../utils/calculateScores';
import { strengthTips } from '../utils/strengthMeta';
import { RadarStrength } from './RadarStrength';
import { classifyType } from '../utils/typeClassifier';
import { fetchItems } from '../utils/fetchItems';
import { useEffect, useState } from 'react';
import { Item } from '../types';

export function ResultPage() {
  // スコアに応じた色を返すヘルパー関数
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-orange-500';
    return 'text-red-600';
  };

  const history = useHistory();
  const { answers, reset } = useQuizStore(); // reset を取得 (clearAnswers から変更)
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false); // Move this hook to the top level

  useEffect(() => {
    // 未回答なら/quizへ
    if (Object.keys(answers).length === 0) {
      history.push('/quiz');
      return;
    }

    // 問題を取得
    fetchItems().then(items => {
      setItems(items);
      setLoading(false);
    });
  }, [answers, history]);
  
  // ページ遷移時に最上部にスクロールする
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">計算中...</div>
      </div>
    );
  }

  // 得点計算
  const { sorted, scoreMap } = calculateScores(answers, items);
  const userType = classifyType(scoreMap);

  // Add this check for userType
  if (!userType) {
    // This can happen if scores don't map to a defined type
    // All hooks are already called before this point, so this check itself doesn't violate hook rules.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
        <p className="text-gray-700 mb-4 text-center">診断結果のタイプを特定できませんでした。もう一度最初からお試しください。</p>
        <button
          onClick={() => { reset(); history.push('/'); }}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          トップに戻る
        </button>
      </div>
    );
  }
  // If we are here, userType is defined.

  // Now userType can be safely accessed.
  const typeImageSrc = `/img/${userType.id.toLowerCase()}_${userType.imageNamePart}.png`;
  const shareName = userType.name.split(' – ')[0]; // No longer needs userType && check if userType is guaranteed

  console.log('[ResultPage] answers:', JSON.stringify(answers));
  console.log('[ResultPage] items length:', items ? items.length : 'undefined'); // items全体ではなく長さをログ
  console.log('[ResultPage] scoreMap:', JSON.stringify(scoreMap));
  console.log('[ResultPage] userType:', JSON.stringify(userType));
  console.log('[ResultPage] typeImageSrc:', typeImageSrc);


  // 最も高いスコアの能力を取得（sorted配列の最初の要素）
  const topSkill = sorted.length > 0 ? sorted[0].name : '不明';
  
  // キャラクターとキーワードの部分を抽出
  const characterType = userType.name.includes('型') ? userType.name.split('型')[0] + '型' : '';
  const keyword = userType.catchCopy.includes('"') ? userType.catchCopy.split('"')[1] : '';
  
  const shareText = `私のAI強み診断結果は「${shareName}」${characterType} "${keyword}"。
最も高い能力は${topSkill}でした。
#AIストファイ`;
  const encodedShareText = encodeURIComponent(shareText);
  
  const currentPageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedCurrentPageUrl = encodeURIComponent(currentPageUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedCurrentPageUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedCurrentPageUrl}&quote=${encodedShareText}`;

  const handleCopyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText)
        .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
            console.error('クリップボードへのコピーに失敗しました:', err);
            alert('コピーに失敗しました。手動でコピーしてください。');
        });
    } else {
        alert('お使いのブラウザはクリップボード機能に対応していません。手動でコピーしてください。');
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          あなたのAI時代における強み
        </h1>

        {/* タイプ表示 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl mr-2">{userType.icon}</span>
            <h2 className="text-2xl font-bold">
              あなたの診断結果： <span className="text-indigo-600 font-semibold">{userType.name}</span>
            </h2>
          </div>
          <p className="text-2xl font-semibold text-center mb-2">
            {(() => {
              const parts = userType.catchCopy.split(' "');
              if (parts.length === 2 && parts[1].endsWith('"')) {
                const prefix = parts[0] + ' "';
                const highlight = parts[1].slice(0, -1); // Remove trailing quote
                return (
                  <>
                    {prefix}
                    <span className="text-teal-600 font-semibold">{highlight}</span>
                    "
                  </>
                );
              }
              return userType.catchCopy; // Fallback if format doesn't match
            })()}
          </p>
          <p className="text-sm text-gray-500 text-center mb-4">{userType.characterSource}</p>
          <p className="text-md text-gray-700 text-center mb-4 whitespace-pre-wrap">{userType.explanation}</p>
          <img
            src={typeImageSrc}
            alt={userType.name}
            className="mt-4 mx-auto block rounded-lg shadow-md"
            style={{ maxWidth: '100%', maxHeight: '300px' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // 画像がない場合は非表示
          />
        </div>

        {/* レーダーチャート */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-center">
            スキルレーダー
          </h3>
          <RadarStrength scores={sorted} />
        </div>

        {/* 詳細スコア */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            詳細スコア
          </h3>
          <div className="space-y-4">
            {sorted.map(({ id, name, score }) => (
              <div key={id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-lg">{name}</span>
                  <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score} <span className="text-sm text-gray-500 font-normal">/ 10</span></span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{strengthTips[id]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* シェアボタンセクション */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-6 text-gray-800">結果をシェアする</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow hover:shadow-md transform hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              Xでシェア
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow hover:shadow-md transform hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              Facebookでシェア
            </a>
            <button
              onClick={handleCopyToClipboard}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow hover:shadow-md transform hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm0 1a1 1 0 011-1h4a1 1 0 011 1v1H7V3zM7 5h6v10H7V5zm2 1a1 1 0 00-1 1v1a1 1 0 102 0V7a1 1 0 00-1-1z"></path></svg>
              {copied ? 'コピーしました！' : 'Instagram用にコピー'}
            </button>
          </div>
          {copied && <p className="text-sm text-green-600 mt-2">クリップボードにコピーしました！</p>}
          <p className="text-xs text-gray-500 mt-3">Instagramには、コピーしたテキストを投稿に貼り付けてください。</p>
        </div>

        {/* 戻るボタン */}
        <div className="text-center mt-8">
          <button
            onClick={() => { reset(); history.push('/'); }}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            トップに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
