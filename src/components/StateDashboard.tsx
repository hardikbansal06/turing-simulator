import React from 'react';
import type { TransitionRule } from '../types';
import { Activity, ArrowRight, Eye, Play, Cpu } from 'lucide-react';

interface StateDashboardProps {
  currentState: string;
  currentSymbol: string;
  nextRule: TransitionRule | null;
  stepCount: number;
  isHalted: boolean;
}

export const StateDashboard: React.FC<StateDashboardProps> = ({
  currentState,
  currentSymbol,
  nextRule,
  stepCount,
  isHalted
}) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col gap-6 w-full max-w-sm">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Machine Status
        </h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isHalted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          {isHalted ? 'Halted' : 'Running'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> State
          </div>
          <div className="text-3xl font-bold text-slate-100 font-mono tracking-tight">{currentState}</div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Reading
          </div>
          <div className="text-3xl font-bold text-sky-400 font-mono tracking-tight">{currentSymbol}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5" /> Next Action
        </div>
        {nextRule && !isHalted ? (
          <div className="flex items-center gap-3 text-sm font-mono text-slate-300">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 text-[10px]">WRITE</span>
              <span className="text-lg text-emerald-400 font-bold">{nextRule.writeSymbol}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex flex-col items-center">
              <span className="text-slate-500 text-[10px]">MOVE</span>
              <span className="text-lg text-amber-400 font-bold">{nextRule.direction === 'L' ? 'LEFT' : nextRule.direction === 'R' ? 'RIGHT' : 'HALT'}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex flex-col items-center">
              <span className="text-slate-500 text-[10px]">STATE</span>
              <span className="text-lg text-indigo-400 font-bold">{nextRule.nextState}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic mt-1 font-mono">
            {isHalted ? 'Machine has halted.' : 'No matching rule found. Machine will halt.'}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500 font-mono flex justify-between items-center pt-2">
        <span>Step Count:</span>
        <span className="font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">{stepCount}</span>
      </div>
    </div>
  );
};
