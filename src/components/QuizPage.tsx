import { useEffect, useState } from 'react';
import { fetchItems } from '../utils/fetchItems';
import type { Item } from '../types';

type Strength = {
  id: string;
  name: string;
  score: number;
};

export function QuizPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [strengths, setStrengths] = useState<Strength[]>([]);
  
  useEffect(() => {
    fetchItems().then(data => {
      console.log('Loaded items:', data);
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAnswer = (itemId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const calculateResults = () => {
    const strengthScores: Record<string, number> = {};
    
    items.forEach(item => {
      const answer = answers[item.id];
      if (answer !== undefined) {
        strengthScores[item.strength] = (strengthScores[item.strength] || 0) + answer;
      }
    });

    const results: Strength[] = Object.entries(strengthScores).map(([id, score]) => ({
      id,
      name: getStrengthName(id),
      score
    })).sort((a, b) => b.score - a.score);

    setStrengths(results);
    setShowResults(true);
  };

  const getStrengthName = (id: string) => {
    const names: Record<string, string> = {
      'AIDIR': 'AI指示力',
      'TOOLC': 'ツール活用力',
      'IDEAS': 'アイデア創出力'
    };
    return names[id] || id;
  };

  if (showResults) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">AIストファイ</h1>
        <p className="text-gray-600 mb-8">AI時代の新しいあなたの強み分析</p>
        <h2 className="text-xl font-semibold mb-4">あなたの強み</h2>
        <div className="space-y-4">
          {strengths.map(strength => (
            <div key={strength.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{strength.name}</h3>
                <span className="text-blue-500 font-semibold">{strength.score}点</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setAnswers({});
            setShowResults(false);
          }}
          className="mt-8 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          もう一度診断する
        </button>
      </div>
    );
  }

  const isQuizComplete = items.every(item => answers[item.id] !== undefined);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AIストファイ</h1>
      <p className="text-gray-600 mb-8">AI時代の新しいあなたの強み分析</p>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white rounded shadow">
            <p className="mb-2">{item.text}</p>
            {item.type === 'likert' ? (
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    className={`px-4 py-2 rounded ${answers[item.id] === value ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => handleAnswer(item.id, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {item.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-2 rounded ${answers[item.id] === index ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => handleAnswer(item.id, index)}
                  >
                    {option}
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
          className="mt-8 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          結果を見る
        </button>
      )}
    </div>
  );
}
