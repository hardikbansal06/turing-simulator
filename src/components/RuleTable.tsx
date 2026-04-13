import React from 'react';
import type { TransitionRule } from '../types';
import { Settings2, ArrowRight } from 'lucide-react';

interface RuleTableProps {
  rules: TransitionRule[];
  activeRuleIndex: number | null;
}

export const RuleTable: React.FC<RuleTableProps> = ({ rules, activeRuleIndex }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-slate-700 pb-4 mb-4">
        <Settings2 className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-slate-100">Transition Rules</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <th className="pb-3 font-medium px-4">State</th>
              <th className="pb-3 font-medium px-4">Read</th>
              <th className="pb-3 font-medium text-center w-8"></th>
              <th className="pb-3 font-medium px-4">Write</th>
              <th className="pb-3 font-medium px-4">Move</th>
              <th className="pb-3 font-medium px-4">Next State</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {rules.map((rule, index) => {
              const isActive = index === activeRuleIndex;
              return (
                <tr 
                  key={index} 
                  className={`border-b border-slate-700/50 transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-300' 
                      : 'text-slate-300 hover:bg-slate-700/30'
                  }`}
                >
                  <td className="py-3 px-4 font-bold">{rule.currentState}</td>
                  <td className="py-3 px-4">{rule.readSymbol}</td>
                  <td className="py-3 px-2 text-slate-600 flex justify-center mt-3"><ArrowRight className="w-4 h-4" /></td>
                  <td className="py-3 px-4 text-emerald-400">{rule.writeSymbol}</td>
                  <td className="py-3 px-4 text-amber-400">{rule.direction}</td>
                  <td className="py-3 px-4 text-indigo-400 font-bold">{rule.nextState}</td>
                </tr>
              );
            })}
            {rules.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                  No rules defined.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
