import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PixelColor } from '../types';
import { calculateAverageGrayscale, getContrastYIQ } from '../utils/colorUtils';
import { CheckCircle2, AlertCircle, Sparkles, RotateCcw, CheckCheck, HelpCircle } from 'lucide-react';

interface GrayscaleSectionProps {
  pixels: [PixelColor, PixelColor, PixelColor];
  userInputs: [string, string, string];
  onInputChange: (index: number, value: string) => void;
  onAutoFill: () => void;
  onClearInputs: () => void;
}

export const GrayscaleSection: React.FC<GrayscaleSectionProps> = ({
  pixels,
  userInputs,
  onInputChange,
  onAutoFill,
  onClearInputs,
}) => {
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Calculate expected answers if pixels are filled
  const expectedAnswers = pixels.map((p) =>
    p ? calculateAverageGrayscale(p).rounded : null
  );

  // Check validation states
  const validationStates = userInputs.map((input, idx) => {
    if (input.trim() === '') return 'empty';
    const num = parseInt(input, 10);
    if (isNaN(num)) return 'invalid';
    const expected = expectedAnswers[idx];
    if (expected !== null && num === expected) return 'correct';
    return 'incorrect';
  });

  const allFilled = validationStates.every((st) => st !== 'empty' && st !== 'invalid');
  const allCorrect =
    expectedAnswers.every((ans) => ans !== null) &&
    validationStates.every((st) => st === 'correct');

  // Trigger confetti when user solves all correctly
  useEffect(() => {
    if (allCorrect && !hasCelebrated) {
      setHasCelebrated(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F9D58', '#4285F4', '#FBBC05', '#EA4335', '#9333ea'],
      });
    } else if (!allCorrect) {
      setHasCelebrated(false);
    }
  }, [allCorrect, hasCelebrated]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all">
      {/* Header: (5) '결과 이미지 B''로 수정 */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-5 bg-slate-800 rounded-full" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            결과 이미지 B' <span className="text-xs font-normal text-slate-500">(1행 3열)</span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onAutoFill}
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
            title="계산된 결과값을 자동으로 입력합니다"
          >
            <CheckCheck className="w-3 h-3 text-emerald-600" />
            <span>정답 자동입력</span>
          </button>
          <button
            onClick={onClearInputs}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
            title="입력값 비우기"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* --- (4) Swapped Position 1 (TOP): 계산 결과 입력 행렬 (1행 3열 빈칸 3개) --- */}
      <div className="mb-4">
        <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800">계산 결과 입력 행렬</span>
            <span className="text-[10px] text-slate-500 font-mono">1행 3열 빈칸 3개</span>
          </div>
          <span className="text-[10px] text-slate-400">범위: 0 ~ 255</span>
        </div>

        {/* Matrix B' Bracket & Inputs */}
        <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-800 text-white font-serif font-bold text-xs shadow-xs">
                B'
              </span>
            </div>
            <span className="text-slate-400 font-serif text-lg font-light">=</span>

            {/* 1x3 Input Matrix with Parentheses */}
            <div className="flex-1 flex items-center relative py-0.5">
              <span className="text-3xl font-light text-slate-400 select-none mr-1">(</span>

              <div className="grid grid-cols-3 gap-2 flex-1">
                {[0, 1, 2].map((idx) => {
                  const state = validationStates[idx];
                  const value = userInputs[idx];
                  const expected = expectedAnswers[idx];

                  return (
                    <div key={idx} className="relative flex flex-col">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`m₁${idx + 1}`}
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val === '') {
                            onInputChange(idx, '');
                          } else {
                            const num = Math.min(255, parseInt(val, 10));
                            onInputChange(idx, isNaN(num) ? '' : num.toString());
                          }
                        }}
                        className={`w-full py-2 px-1 text-center font-mono font-bold text-sm sm:text-base rounded-lg border-2 shadow-2xs transition-all focus:outline-none ${
                          state === 'correct'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-300/40'
                            : state === 'incorrect'
                            ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-300/40'
                            : 'bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300/40'
                        }`}
                      />

                      {/* Sub-label under each input */}
                      <div className="flex items-center justify-between px-0.5 mt-0.5 text-[9px]">
                        <span className="font-mono text-slate-400">
                          m₁{idx + 1}
                        </span>
                        {state === 'incorrect' && expected !== null && (
                          <span className="text-amber-600 font-bold" title={`정답: ${expected}`}>
                            힌트:{expected}
                          </span>
                        )}
                        {state === 'correct' && (
                          <span className="text-emerald-600 font-bold">
                            일치!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <span className="text-3xl font-light text-slate-400 select-none ml-1">)</span>
            </div>
          </div>
        </div>

        {/* Matrix Column Indicator */}
        <div className="flex justify-between items-center px-8 pt-1 text-[9px] font-mono text-slate-400">
          <span className="w-16 text-center">1열 성분</span>
          <span className="w-16 text-center">2열 성분</span>
          <span className="w-16 text-center">3열 성분</span>
        </div>
      </div>

      {/* --- (4) Swapped Position 2 (BOTTOM): 실시간 결과 이미지 뷰 (회색조) --- */}
      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1.5">
            <span>실시간 결과 이미지 뷰</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            위 입력값 실시간 반영
          </span>
        </div>

        {/* 3 Result Image Pixels in 1 Row */}
        <div className="grid grid-cols-3 gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
          {userInputs.map((input, idx) => {
            const rawVal = input.trim();
            const num = rawVal !== '' ? parseInt(rawVal, 10) : NaN;
            const hasValidValue = !isNaN(num) && num >= 0 && num <= 255;
            const state = validationStates[idx];

            const grayColor = hasValidValue
              ? `rgb(${num}, ${num}, ${num})`
              : 'transparent';

            const contrast = hasValidValue
              ? getContrastYIQ(num, num, num)
              : 'black';

            return (
              <div
                key={idx}
                className={`relative flex flex-col rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-2xs ${
                  state === 'correct'
                    ? 'border-emerald-500 ring-2 ring-emerald-400/30'
                    : state === 'incorrect'
                    ? 'border-amber-400'
                    : 'border-dashed border-slate-300'
                }`}
              >
                {/* Pixel Label */}
                <div className="absolute top-1 left-1.5 z-10">
                  <span
                    className={`text-[9px] font-mono font-bold px-1 rounded ${
                      hasValidValue
                        ? contrast === 'white'
                          ? 'bg-black/50 text-white'
                          : 'bg-white/90 text-slate-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1행 {idx + 1}열
                  </span>
                </div>

                {/* Validation Badge */}
                {hasValidValue && (
                  <div className="absolute top-1 right-1 z-10">
                    {state === 'correct' ? (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.5 rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 className="w-2 h-2" /> 정답
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-amber-500 text-white">
                        오답
                      </span>
                    )}
                  </div>
                )}

                {/* Grayscale Swatch (matching half-size aesthetic: h-16) */}
                <div
                  className="h-16 w-full flex flex-col items-center justify-center p-1 text-center transition-colors duration-200 relative"
                  style={{
                    backgroundColor: hasValidValue ? grayColor : undefined,
                    backgroundImage: !hasValidValue
                      ? 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)'
                      : undefined,
                    backgroundSize: '10px 10px',
                  }}
                >
                  {hasValidValue ? (
                    <>
                      <div
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded backdrop-blur-xs ${
                          contrast === 'white' ? 'bg-black/40 text-white' : 'bg-white/80 text-black'
                        }`}
                      >
                        명암: {num}
                      </div>
                      <div
                        className={`text-[9px] font-mono mt-0.5 ${
                          contrast === 'white' ? 'text-white/80' : 'text-black/80'
                        }`}
                      >
                        rgb({num},{num},{num})
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span className="text-[10px] font-semibold">입력 대기</span>
                      <span className="text-[8px] text-slate-400">위 빈칸에 값 입력</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Notification Banner */}
        <div className="mt-2.5">
          {allCorrect ? (
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold animate-in fade-in duration-150">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>정답입니다! 결과 이미지 B'가 완벽하게 변환되었습니다.</span>
            </div>
          ) : allFilled ? (
            <div className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>일부 결괏값이 맞지 않습니다. 가운데 계산식을 확인하세요.</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-slate-50 text-slate-500 text-[11px] border border-slate-200">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>가운데 계산식에서 구한 세 값을 위 1행 3열 빈칸에 입력하세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
