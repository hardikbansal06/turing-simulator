import { useState, useEffect, useCallback, useRef } from 'react';
import { Bot, Play, Pause, StepForward, RotateCcw } from 'lucide-react';



export type Direction = 'L' | 'R' | 'N';
export type TapeDict = Record<number, string>;

export interface TransitionRule {
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  direction: Direction;
  nextState: string;
}

export class TuringMachineModel {
  public tape: TapeDict;
  public headPosition: number;
  public currentState: string;
  public rules: TransitionRule[];
  public isHalted: boolean;
  public stepCount: number;
  public blankSymbol: string;

  constructor(
    initialTape: string,
    rules: TransitionRule[],
    initialState: string = 'q0',
    blankSymbol: string = 'Δ'
  ) {
    this.tape = {};
    for (let i = 0; i < initialTape.length; i++) {
      this.tape[i] = initialTape[i];
    }
    this.headPosition = 0;
    this.currentState = initialState;
    this.rules = rules;
    this.isHalted = false;
    this.stepCount = 0;
    this.blankSymbol = blankSymbol;
  }

  public step(): boolean {
    if (this.isHalted) return false;

    const currentSymbol = this.tape[this.headPosition] || this.blankSymbol;
    const rule = this.rules.find(
      (r) => r.currentState === this.currentState && r.readSymbol === currentSymbol
    );

    if (!rule) {
      this.isHalted = true;
      return false;
    }


    this.tape[this.headPosition] = rule.writeSymbol;


    if (rule.direction === 'L') {
      this.headPosition -= 1;
    } else if (rule.direction === 'R') {
      this.headPosition += 1;
    }


    this.currentState = rule.nextState;
    this.stepCount += 1;


    if (this.currentState === 'halt' || rule.direction === 'N') {
      this.isHalted = true;
    }

    return true;
  }

  public getCurrentSymbol(): string {
    return this.tape[this.headPosition] || this.blankSymbol;
  }

  public getActiveRule(): TransitionRule | undefined {
    const symbol = this.getCurrentSymbol();
    return this.rules.find(
      (r) => r.currentState === this.currentState && r.readSymbol === symbol
    );
  }
}



export function useTuringMachine(
  initialInput: string,
  rules: TransitionRule[],
  playbackDelayMs: number = 500
) {

  const machineRef = useRef(new TuringMachineModel(initialInput, rules));
  

  const [tapeState, setTapeState] = useState<TapeDict>({ ...machineRef.current.tape });
  const [headPos, setHeadPos] = useState(machineRef.current.headPosition);
  const [currentState, setCurrentState] = useState(machineRef.current.currentState);
  const [isHalted, setIsHalted] = useState(machineRef.current.isHalted);
  const [stepCount, setStepCount] = useState(machineRef.current.stepCount);
  const [isPlaying, setIsPlaying] = useState(false);


  const syncState = useCallback(() => {
    const m = machineRef.current;
    setTapeState({ ...m.tape });
    setHeadPos(m.headPosition);
    setCurrentState(m.currentState);
    setIsHalted(m.isHalted);
    setStepCount(m.stepCount);
  }, []);

  const loadInput = useCallback((input: string) => {
    machineRef.current = new TuringMachineModel(input, rules);
    setIsPlaying(false);
    syncState();
  }, [rules, syncState]);

  const step = useCallback(() => {
    const m = machineRef.current;
    if (m.isHalted) {
      setIsPlaying(false);
      return;
    }
    m.step();
    syncState();
    
    if (m.isHalted) {
      setIsPlaying(false);
    }
  }, [syncState]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);


  useEffect(() => {
    let intervalId: number;
    if (isPlaying && !isHalted) {
      intervalId = window.setInterval(() => {
        step();
      }, playbackDelayMs);
    }
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, isHalted, step, playbackDelayMs]);

  return {
    tape: tapeState,
    headPos,
    currentState,
    isHalted,
    stepCount,
    isPlaying,
    currentSymbol: machineRef.current.getCurrentSymbol(),
    activeRule: machineRef.current.getActiveRule(),
    loadInput,
    step,
    togglePlay,
  };
}



const TapeVisualizer = ({ tape, headPos, blankSymbol }: { tape: TapeDict; headPos: number; blankSymbol: string }) => {
  const visibleRange = 10;
  const cells = [];

  for (let i = headPos - visibleRange; i <= headPos + visibleRange; i++) {
    const isHead = i === headPos;
    const symbol = tape[i] !== undefined ? tape[i] : blankSymbol;
    
    cells.push(
      <div 
        key={i} 
        className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 border rounded-md shadow-sm transition-all duration-300 ${
          isHead 
            ? 'bg-indigo-500 border-indigo-400 text-white transform scale-110 z-10' 
            : 'bg-slate-800 border-slate-700 text-slate-300'
        }`}
      >
        <span className="text-xs opacity-50 mb-1">{i}</span>
        <span className="text-xl font-bold">{symbol}</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-slate-900 justify-center flex p-6 rounded-xl border border-slate-700 relative">
      <div className="absolute left-1/2 top-1 -translate-x-1/2 text-2xl text-indigo-400 animate-bounce">
        ▼
      </div>
      <div className="flex gap-2 justify-center items-center overflow-hidden transition-transform duration-500 ease-in-out relative pt-4">
        {cells}
      </div>
    </div>
  );
};

const Controls = ({ 
  isPlaying, 
  isHalted, 
  onLoad, 
  onStep, 
  onTogglePlay 
}: { 
  isPlaying: boolean; 
  isHalted: boolean; 
  onLoad: (input: string) => void;
  onStep: () => void;
  onTogglePlay: () => void;
}) => {
  const [inputVal, setInputVal] = useState('101100');

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Controls</h3>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 font-mono text-lg"
          placeholder="Enter bit string..."
        />
        <button 
          onClick={() => onLoad(inputVal)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
        >
          Load
        </button>
      </div>

      <div className="flex gap-3 justify-center mt-2">
        <button 
          onClick={onTogglePlay} 
          disabled={isHalted}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-lg font-bold transition-colors ${
            isHalted ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : isPlaying ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button 
          onClick={onStep} 
          disabled={isPlaying || isHalted}
          className="flex-1 flex justify-center items-center gap-2 py-3 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg font-bold transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <StepForward className="w-5 h-5" />
          Step
        </button>
        
        <button 
          onClick={() => Object.is(onLoad(inputVal), undefined)}
          className="flex-1 flex justify-center items-center gap-2 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-bold transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
};

const StateDashboard = ({ currentState, currentSymbol, stepCount, isHalted }: any) => (
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center shadow-lg">
      <span className="text-slate-400 text-sm font-medium mb-1">State</span>
      <span className={`text-2xl font-bold font-mono ${isHalted && currentState === 'halt' ? 'text-red-400' : 'text-emerald-400'}`}>
        {currentState}
      </span>
    </div>
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center shadow-lg">
      <span className="text-slate-400 text-sm font-medium mb-1">Reading</span>
      <span className="text-2xl font-bold font-mono text-indigo-400">'{currentSymbol}'</span>
    </div>
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center shadow-lg">
      <span className="text-slate-400 text-sm font-medium mb-1">Steps</span>
      <span className="text-2xl font-bold font-mono text-amber-400">{stepCount}</span>
    </div>
  </div>
);

const RuleTable = ({ rules, activeRule }: { rules: TransitionRule[], activeRule?: TransitionRule }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Transition Rules</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-900/30 text-slate-400">
          <tr>
            <th className="px-6 py-3 font-medium tracking-wider">Current State</th>
            <th className="px-6 py-3 font-medium tracking-wider">Read Symbol</th>
            <th className="px-6 py-3 font-medium tracking-wider">Write Symbol</th>
            <th className="px-6 py-3 font-medium tracking-wider">Direction</th>
            <th className="px-6 py-3 font-medium tracking-wider">Next State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {rules.map((rule, idx) => {
            const isActive = activeRule === rule;
            return (
              <tr key={idx} className={`transition-colors ${isActive ? 'bg-indigo-500/20' : 'hover:bg-slate-700/50'}`}>
                <td className="px-6 py-3 font-mono">
                  {isActive && <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>}
                  {rule.currentState}
                </td>
                <td className="px-6 py-3 font-mono">'{rule.readSymbol}'</td>
                <td className="px-6 py-3 font-mono text-amber-400">'{rule.writeSymbol}'</td>
                <td className="px-6 py-3 font-bold text-slate-300">{rule.direction}</td>
                <td className={`px-6 py-3 font-mono ${rule.nextState === 'halt' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {rule.nextState}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);



const DEFAULT_RULES: TransitionRule[] = [
  { currentState: 'q0', readSymbol: '0', writeSymbol: '1', direction: 'R', nextState: 'q0' },
  { currentState: 'q0', readSymbol: '1', writeSymbol: '0', direction: 'R', nextState: 'q0' },
  { currentState: 'q0', readSymbol: 'Δ', writeSymbol: 'Δ', direction: 'N', nextState: 'halt' },
];

export default function App() {
  const {
    tape,
    headPos,
    currentState,
    isHalted,
    stepCount,
    isPlaying,
    currentSymbol,
    activeRule,
    loadInput,
    step,
    togglePlay,
  } = useTuringMachine('101100', DEFAULT_RULES, 500);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            <Bot className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Turing Machine Simulator
          </h1>
          <span className="ml-auto text-sm font-medium text-slate-400">Binary Inverter Example</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <StateDashboard 
          currentState={currentState} 
          currentSymbol={currentSymbol} 
          stepCount={stepCount} 
          isHalted={isHalted} 
        />
        
        <div className="mb-8">
          <TapeVisualizer tape={tape} headPos={headPos} blankSymbol={'Δ'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-1 lg:col-span-4">
            <Controls 
              isPlaying={isPlaying} 
              isHalted={isHalted} 
              onLoad={loadInput} 
              onStep={step} 
              onTogglePlay={togglePlay} 
            />
          </div>
          <div className="col-span-1 lg:col-span-8">
            <RuleTable rules={DEFAULT_RULES} activeRule={activeRule} />
          </div>
        </div>
      </main>
    </div>
  );
}
