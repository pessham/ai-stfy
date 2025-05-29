import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { calculateScores } from '../utils/calculateScores';
import { strengthTips } from '../utils/strengthMeta';
import { RadarStrength } from './RadarStrength';
import { classifyType } from '../utils/typeClassifier';
import { fetchItems } from '../utils/fetchItems';
import { useEffect, useState } from 'react';
import { Item } from '../types';

export function ResultPage() {
  const navigate = useNavigate();
  const { answers } = useQuizStore();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 未回答なら/quizへ
    if (Object.keys(answers).length === 0) {
      navigate('/quiz');
      return;
    }

    // 問題を取得
    fetchItems().then(items => {
      setItems(items);
      setLoading(false);
    });
  }, [answers, navigate]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          あなたのAI時代における強み
        </h1>

        {/* タイプ表示 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-2">{userType.icon}</span>
            <h2 className="text-2xl font-bold">{userType.name}</h2>
          </div>
          <p className="text-lg text-center mb-4">{userType.catchCopy}</p>
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
              <div key={id} className="border-b pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{name}</span>
                  <span className="text-sm text-gray-600">{score}</span>
                </div>
                <p className="text-sm text-gray-500">{strengthTips[id]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            トップに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
