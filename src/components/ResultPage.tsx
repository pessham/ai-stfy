import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { calculateScores } from '../utils/calculateScores';
import { strengthName, strengthTips } from '../utils/strengthMeta';
import { RadarStrength } from './RadarStrength';

export function ResultPage() {
  const navigate = useNavigate();
  const { items, answers, reset } = useQuizStore();
  
  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const results = calculateScores(answers, items);
  const labels = results.map(({ id }) => strengthName[id]);
  const scores = results.map(({ score }) => Math.min(10, Math.round((score / 25) * 10))); // 25点満点を10点満点に変換

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">あなたの強み分析結果</h1>
        
        {/* レーダーチャート */}
        <div className="mb-8">
          <RadarStrength labels={labels} scores={scores} />
        </div>

        {/* ランキング & Tips */}
        <div className="space-y-4">
          {results.map(({ id, score }, index) => (
            <div key={id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                <h2 className="text-xl font-semibold">{strengthName[id]}</h2>
                <span className="ml-auto text-lg font-medium text-blue-600">{Math.min(10, Math.round((score / 25) * 10))} / 10</span>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {strengthTips[id]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              reset();
              navigate('/');
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
