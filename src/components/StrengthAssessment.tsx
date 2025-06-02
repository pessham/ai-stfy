import React, { useState } from 'react';
import { STRENGTH_CATEGORIES, AssessmentResult, CHARACTER_TYPES, CharacterType } from '../types/strengthTypes';
import { RadarChart } from './RadarChart';
import { CharacterResult } from './CharacterResult';

const questions = [
  {
    id: 'q1',
    text: '新しい課題に直面したとき、どのように対応しますか？',
    category: 'innovation',
  },
  {
    id: 'q2',
    text: 'チームで働く際、どのような役割を担うことが多いですか？',
    category: 'leadership',
  },
  {
    id: 'q3',
    text: '失敗や挫折を経験したとき、どのように対処しますか？',
    category: 'resilience',
  },
  {
    id: 'q4',
    text: '他者の感情や状況をどのように理解し、対応していますか？',
    category: 'empathy',
  },
  {
    id: 'q5',
    text: '専門的なスキルや知識をどのように活用し、向上させていますか？',
    category: 'technical',
  },
];

export const StrengthAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateResults = () => {
    // 各カテゴリーのスコアを計算
    const categoryScores: Record<string, number> = {};
    STRENGTH_CATEGORIES.forEach(category => {
      const relevantQuestions = questions.filter(q => q.category === category.id);
      const categoryAnswers = relevantQuestions.map(q => answers[q.id] || '');
      const score = calculateCategoryScore(categoryAnswers);
      categoryScores[category.id] = score;
    });

    // 最も近いキャラクタータイプを決定
    const characterType = findMatchingCharacter(categoryScores);

    // 結果を生成
    const assessmentResult: AssessmentResult = {
      categories: STRENGTH_CATEGORIES.map(category => ({
        ...category,
        score: categoryScores[category.id],
      })),
      characterType,
      overallScore: Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length,
      aiAnalysis: generateAIAnalysis(categoryScores, characterType),
    };

    setResult(assessmentResult);
  };

  const calculateCategoryScore = (answers: string[]): number => {
    // 回答の長さと内容に基づいて点数を計算
    // これは簡略化された例です。実際のAIベースの評価ロジックはより複雑になります
    const baseScore = answers.reduce((score, answer) => {
      if (!answer) return score;
      return score + Math.min(100, answer.length * 2);
    }, 0);
    return Math.min(100, Math.max(0, baseScore / answers.length));
  };

  const findMatchingCharacter = (scores: Record<string, number>): CharacterType => {
    return CHARACTER_TYPES.reduce((closest, character) => {
      const currentDiff = Object.entries(scores).reduce((diff, [category, score]) => {
        return diff + Math.abs(score - (character.strengths[category] || 0));
      }, 0);

      const closestDiff = Object.entries(scores).reduce((diff, [category, score]) => {
        return diff + Math.abs(score - (closest.strengths[category] || 0));
      }, 0);

      return currentDiff < closestDiff ? character : closest;
    }, CHARACTER_TYPES[0]);
  };

  const generateAIAnalysis = (scores: Record<string, number>, character: CharacterType): string => {
    const strengths = Object.entries(scores)
      .filter(([_, score]) => score >= 80)
      .map(([category]) => STRENGTH_CATEGORIES.find(c => c.id === category)?.name)
      .filter(Boolean);

    const improvements = Object.entries(scores)
      .filter(([_, score]) => score < 60)
      .map(([category]) => STRENGTH_CATEGORIES.find(c => c.id === category)?.name)
      .filter(Boolean);

    return `
あなたは${character.name}のような特徴を持っています。
${strengths.length > 0 ? `特に${strengths.join('、')}が優れています。` : ''}
${improvements.length > 0 ? `${improvements.join('、')}の分野でさらなる成長の機会があります。` : ''}
${character.description}のような特徴を活かして、さらなる成長が期待できます。
    `.trim();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">AIパワード ストレングス診断</h1>
      
      {!result ? (
        <div className="space-y-6">
          {questions.map(question => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl mb-4">{question.text}</h3>
              <textarea
                className="w-full p-3 border rounded"
                rows={4}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="あなたの回答を入力してください..."
              />
            </div>
          ))}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            onClick={calculateResults}
          >
            診断結果を見る
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">診断結果</h2>
            <p className="text-lg mb-4">{result.aiAnalysis}</p>
            <div className="h-80">
              <RadarChart data={result.categories} />
            </div>
          </div>
          <CharacterResult character={result.characterType} />
          <button
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
            onClick={() => setResult(null)}
          >
            もう一度診断する
          </button>
        </div>
      )}
    </div>
  );
};
