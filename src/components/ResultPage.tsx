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
  const typeImageSrc = userType ? `/img/${userType.id.toLowerCase()}_${userType.imageNamePart}.png` : ''; // 例: /img/orch_image.png

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
