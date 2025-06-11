import React from 'react';
import { Tag, TrendingUp } from 'lucide-react';

interface TagCloudProps {
  tags: Array<{ tag: string; count: number }>;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  maxTags?: number;
  showCounts?: boolean;
}

export function TagCloud({ 
  tags, 
  selectedTags, 
  onTagSelect, 
  onTagRemove, 
  maxTags = 20,
  showCounts = true 
}: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags);
  const maxCount = Math.max(...displayTags.map(t => t.count));

  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-lg';
    if (ratio > 0.6) return 'text-base';
    if (ratio > 0.4) return 'text-sm';
    return 'text-xs';
  };

  const getTagOpacity = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'opacity-100';
    if (ratio > 0.6) return 'opacity-90';
    if (ratio > 0.4) return 'opacity-80';
    return 'opacity-70';
  };

  if (displayTags.length === 0) {
    return (
      <div className="text-center py-8">
        <Tag size={32} className="mx-auto text-warm-gray-400 mb-3" />
        <p className="text-warm-gray-600">No tags found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-warm-gray-700">
        <TrendingUp size={16} />
        Popular Tags
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayTags.map(({ tag, count }) => {
          const isSelected = selectedTags.includes(tag);
          
          return (
            <button
              key={tag}
              onClick={() => isSelected ? onTagRemove(tag) : onTagSelect(tag)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 font-medium
                ${getTagSize(count)} ${getTagOpacity(count)}
                ${isSelected
                  ? 'bg-sage-600 text-white shadow-lg transform scale-105'
                  : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-sage-50 hover:text-sage-700 hover:shadow-md hover:scale-105'
                }
              `}
            >
              <Tag size={12} />
              {tag}
              {showCounts && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isSelected 
                    ? 'bg-sage-500 text-sage-100' 
                    : 'bg-warm-gray-200 text-warm-gray-600'
                  }
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {tags.length > maxTags && (
        <p className="text-xs text-warm-gray-500 text-center">
          Showing {maxTags} of {tags.length} tags
        </p>
      )}
    </div>
  );
}