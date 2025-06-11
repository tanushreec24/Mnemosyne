import React from 'react';
import { Plus, Brain, Network, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewNote: () => void;
  onShowGraph: () => void;
}

export function Header({ onNewNote, onShowGraph }: HeaderProps) {
  return (
    <header className="bg-neural-white/80 backdrop-blur-xl shadow-neural border-b border-neural-gray-200/30 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto container-padding py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-lg">
                <Brain size={32} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full animate-pulse-glow opacity-60" />
            </div>
            <div>
              <h1 className="heading-serif text-4xl text-neural-gray-800 mb-1">
                Mnemosyne
              </h1>
              <p className="body-text text-neural-gray-600 flex items-center gap-2">
                <Sparkles size={16} className="text-teal-500" />
                Knowledge Visualization Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onShowGraph}
              className="group flex items-center gap-3 px-6 py-3 bg-neural-gray-100/80 text-neural-gray-700 rounded-2xl hover:bg-neural-gray-200/80 transition-all duration-300 card-shadow hover:card-shadow-hover hover-lift backdrop-blur-sm"
            >
              <Network size={20} className="group-hover:text-teal-600 transition-colors" />
              <span className="font-medium">Neural Graph</span>
            </button>
            <button
              onClick={onNewNote}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 card-shadow hover:card-shadow-hover hover-lift shadow-lg"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">New Thought</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}