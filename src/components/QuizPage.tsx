import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchItems } from '../utils/fetchItems';
import type { Item } from '../types';
import { useQuizStore } from '../store/useQuizStore';

export function QuizPage() {
  const history = useHistory();
  const { setItems: storeSetItems, setAnswers: storeSetAnswers } = useQuizStore();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const loadedItems = await fetchItems();
        setItems(loadedItems);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz items');
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  const progress = Object.keys(answers).length;
  const isQuizComplete = progress === items.length && progress > 0;

  const handleAnswer = (itemId: string, value: number) => {
    const newAnswers = { ...answers, [itemId]: value };
    setAnswers(newAnswers);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">あなたのAI時代の強みを診断</h1>
        <p className="text-xl text-blue-600">以下の質問に答えて、あなたの強みを発見しましょう</p>
      </div>

      <div className="space-y-12">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <span className="text-lg font-semibold text-blue-600 mr-4">問{items.indexOf(item) + 1}</span>
              <h2 className="text-2xl font-bold text-blue-900">{item.text}</h2>
            </div>

            <div className="space-y-4">
              {item.type === 'sjt' ? (
                // 状況判断テストの選択肢
                (item.options as string[]).map((option, index) => (
                  <label
                    key={index}
                    className={`
                      block p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${answers[item.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${item.id}`}
                        value={index}
                        checked={answers[item.id] === index}
                        onChange={() => handleAnswer(item.id, index)}
                        className="sr-only"
                      />
                      <div
                        className={`
                          w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center
                          ${answers[item.id] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }
                        `}
                      >
                        {answers[item.id] === index && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </label>
                ))
              ) : (
                // 5段階評価の選択肢
                [1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className={`
                      block p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${answers[item.id] === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${item.id}`}
                        value={value}
                        checked={answers[item.id] === value}
                        onChange={() => handleAnswer(item.id, value)}
                        className="sr-only"
                      />
                      <div
                        className={`
                          w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center
                          ${answers[item.id] === value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }
                        `}
                      >
                        {answers[item.id] === value && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-lg flex items-center">
                        <span className="mr-2">{value}</span>
                        <span className="text-gray-600 text-base">
                          {value === 1 ? '全く当てはまらない' :
                           value === 2 ? 'あまり当てはまらない' :
                           value === 3 ? 'どちらとも言えない' :
                           value === 4 ? 'やや当てはまる' :
                           '非常に当てはまる'}
                        </span>
                      </span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{progress} / {items.length} 回答済み</span>
            <span>{Math.round((progress / items.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(progress / items.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              storeSetItems(items);
              storeSetAnswers(answers);
              history.push('/result');
            }}
            disabled={!isQuizComplete}
            className={`
              py-4 px-8 rounded-xl text-lg font-medium transition-all transform
              ${isQuizComplete
                ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isQuizComplete ? '結果を見る' : '全ての質問に答えてください'}
          </button>
        </div>
      </div>
    </div>
  );
}
