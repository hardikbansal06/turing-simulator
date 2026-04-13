import React, { useMemo } from 'react';
import type { Tape } from '../types';

interface TapeVisualizerProps {
  tape: Tape;
  headPosition: number;
  blankSymbol: string;
}

export const TapeVisualizer: React.FC<TapeVisualizerProps> = ({ tape, headPosition, blankSymbol }) => {
  const cellSize = 72;

  const indices = useMemo(() => {
    const keys = Object.keys(tape).map(Number);
    const minTape = keys.length ? Math.min(...keys) : 0;
    const maxTape = keys.length ? Math.max(...keys) : 0;
    

    const minRender = Math.min(minTape, headPosition - 20);
    const maxRender = Math.max(maxTape, headPosition + 20);
    
    const arr = [];
    for (let i = minRender; i <= maxRender; i++) {
        arr.push(i);
    }
    return arr;
  }, [tape, headPosition]);

  return (
    <div className="relative w-full h-56 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex items-center justify-center">
      

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none"></div>


      <div className="absolute top-6 flex flex-col items-center justify-center z-20 pointer-events-none">
        <div className="text-emerald-400 font-bold mb-1 text-xs tracking-widest uppercase bg-slate-900/80 px-2 py-1 rounded-md shadow border border-emerald-400/20">Head</div>
        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-transparent border-t-emerald-400 animate-bounce cursor-default"></div>
      </div>


      <div className="absolute w-16 h-16 bg-emerald-400/10 rounded-xl border border-emerald-400/40 z-0 shadow-[0_0_20px_rgba(52,211,153,0.3)]"></div>


      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div 
          className="relative w-full h-full"
          style={{ 
            transform: `translateX(${-headPosition * cellSize}px)`, 
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {indices.map(index => {
            const isHead = index === headPosition;
            const content = tape[index] || blankSymbol;
            const isBlank = content === blankSymbol;

            return (
              <div 
                key={index}
                className={`absolute w-16 h-16 flex flex-col items-center justify-center rounded-xl font-mono text-3xl font-bold transition-all duration-300
                  ${isHead ? 'text-emerald-400 scale-110 z-10' : 'text-slate-300 bg-slate-700/60 shadow-lg border border-slate-600/50 hover:bg-slate-700'}
                  ${isBlank && !isHead ? 'opacity-40' : ''}
                `}
                style={{
                  left: `calc(50% + ${index * cellSize}px)`,
                  transform: 'translateX(-50%)',
                }}
              >
                {content}

                <div className="absolute -bottom-6 text-[10px] text-slate-500 font-sans tracking-wide">
                  {index}
                </div>
              </div>
            )
          })}
        </div>
      </div>


      <div className="absolute top-[65%] w-full h-1 bg-slate-700/50 z-0"></div>
    </div>
  );
};
