import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { calculateScores } from '../utils/calculateScores';
import { strengthName, strengthTips } from '../utils/strengthMeta';
import { StrengthKey } from '../types';

export function ResultPage() {
  const navigate = useNavigate();
  const { items, answers, reset } = useQuizStore();
  
  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const scores = calculateScores(answers, items);
  const maxScore = scores[0][1];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">あなたの強み分析結果</h1>
        
        <div className="space-y-6">
          {scores.map(([key, score], index) => {
            const strengthKey = key as StrengthKey;
            const percentage = (score / maxScore) * 100;
            
            return (
              <div key={key} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <h2 className="text-xl font-semibold">{strengthName[strengthKey]}</h2>
                </div>

                {/* Progress bar */}
                <div className="w-full h-4 bg-gray-100 rounded-full mb-4">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {strengthTips[strengthKey]}
                </p>
              </div>
            );
          })}
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
