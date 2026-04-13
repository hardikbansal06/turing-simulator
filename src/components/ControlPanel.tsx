import React, { useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Upload } from 'lucide-react';

interface ControlPanelProps {
  onLoad: (input: string) => void;
  onStep: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  isPlaying: boolean;
  isHalted: boolean;
  initialString: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onLoad,
  onStep,
  onTogglePlay,
  onReset,
  isPlaying,
  isHalted,
  initialString
}) => {
  const [inputVal, setInputVal] = useState(initialString);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl w-full">
      <div className="flex flex-col gap-6">
        

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Initial Tape Input
            </label>
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              placeholder="e.g. 101011"
            />
          </div>
          <button 
            onClick={() => onLoad(inputVal)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Upload className="w-4 h-4" /> Load
          </button>
        </div>

        <div className="h-px bg-slate-700 w-full" />


        <div className="flex gap-4 items-center justify-center">
          <button 
            onClick={onReset}
            className="flex flex-col items-center gap-1 p-3 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset to loaded state"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Reset</span>
          </button>
          
          <button 
            onClick={onStep}
            disabled={isPlaying || isHalted}
            className={`flex flex-col items-center gap-1 p-3 transition-colors ${isPlaying || isHalted ? 'text-slate-600 cursor-not-allowed' : 'text-sky-400 hover:text-sky-300'}`}
            title="Step forward one transition"
          >
            <SkipForward className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Step</span>
          </button>

          <button 
            onClick={onTogglePlay}
            disabled={isHalted}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-xl ${
              isHalted
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                : isPlaying 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 shadow-rose-500/20' 
                  : 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" /> Auto Play
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
