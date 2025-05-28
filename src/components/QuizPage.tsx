import { useEffect, useState } from 'react';
import { fetchItems } from '../utils/fetchItems';
import type { Item } from '../types';
import { calculateScores, type StrengthScore } from '../utils/calculateScores';
import { strengthTips } from '../utils/strengthMeta';

export function QuizPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [strengths, setStrengths] = useState<StrengthScore[]>([]);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems()
      .then(data => {
        console.log('Loaded items:', data);
        setItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading items:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-6 text-red-600">エラーが発生しました</h1>
          <p className="text-red-500 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white py-3 px-8 rounded-xl text-lg font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">読み込み中...</h1>
        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  const handleAnswer = (itemId: string, value: number) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [itemId]: value };
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
  };

  const calculateResults = () => {
    console.log('Calculating results with answers:', answers);
    console.log('Items:', items);
    const results = calculateScores(answers, items);
    console.log('Calculated results:', results);
    setStrengths(results);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">あなたの強み分析結果</h1>
          <p className="text-xl text-blue-600">あなたのAI時代を生き抜くための強みを分析しました</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {strengths.map((strength: StrengthScore, index: number) => (
            <div key={strength.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-2">#{index + 1}</span>
                  <h3 className="text-2xl font-bold text-blue-900">{strength.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-blue-500">{strength.score}</span>
                  <span className="text-sm text-blue-400">点</span>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{strengthTips[strength.id]}</p>
              <div className="relative pt-4">
                <div className="flex justify-between text-sm text-blue-400 mb-2">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${(strength.score / 10) * 100}%` }}
                  >
                    <span className="absolute -right-1 -top-1 w-5 h-5 bg-white rounded-full border-4 border-blue-500"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => {
              setAnswers({});
              setShowResults(false);
            }}
            className="inline-flex items-center justify-center bg-blue-500 text-white text-lg font-medium py-4 px-8 rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            もう一度診断する
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalCount = items.length;
  const progress = (answeredCount / totalCount) * 100;
  const isQuizComplete = answeredCount === totalCount;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AIストファイ</h1>
      <p className="text-gray-600 mb-4">AI時代の新しいあなたの強み分析</p>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>進捗状況</span>
          <span>{answeredCount} / {totalCount} 問</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-blue-500 mr-3">Q{index + 1}</span>
                <span className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full">
                  {item.type === 'likert' ? '評価質問' : '状況判断問題'}
                </span>
              </div>
              <div className="text-sm text-blue-400">{index + 1} / {items.length}</div>
            </div>
            <p className="text-xl mb-8 leading-relaxed">{item.text}</p>
            {item.type === 'likert' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-medium text-blue-600">
                  <div>全く当てはまらない</div>
                  <div>非常に当てはまる</div>
                </div>
                <div className="flex justify-between items-center space-x-4">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      className={`w-16 h-16 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${answers[item.id] === value
                        ? 'bg-blue-500 text-white ring-4 ring-blue-200 ring-offset-2 shadow-lg'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-900'}`}
                      onClick={() => handleAnswer(item.id, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {item.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-6 rounded-xl transition-all transform hover:scale-[1.02] ${answers[item.id] === index
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200 ring-offset-2 shadow-lg'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-900'}`}
                    onClick={() => handleAnswer(item.id, index)}
                  >
                    <div className="flex items-center">
                      <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white bg-opacity-20 mr-4 text-lg font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {isQuizComplete && (
        <button
          onClick={calculateResults}
          className="mt-8 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
        >
          診断結果を見る
        </button>
      )}
    </div>
  );
}
