import React from 'react';
import { CharacterType } from '../types/strengthTypes';

interface CharacterResultProps {
  character: CharacterType;
}

export const CharacterResult: React.FC<CharacterResultProps> = ({ character }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">あなたに最も近いキャラクター</h2>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-48 h-48 relative">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{character.name}</h3>
          <p className="text-gray-600 mb-2">シリーズ: {character.series}</p>
          <p className="text-lg">{character.description}</p>
          <div className="mt-4">
            <h4 className="font-bold mb-2">キャラクター特性:</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(character.strengths).map(([category, score]) => (
                <div key={category} className="flex items-center gap-2">
                  <span className="font-medium">{category}:</span>
                  <span>{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
