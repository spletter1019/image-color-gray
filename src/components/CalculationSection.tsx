import React from 'react';
import { PixelColor, NumeratorSlots } from '../types';
import { rgbToHex } from '../utils/colorUtils';
import { MousePointerClick, CheckCheck, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CalculationSectionProps {
  pixels: [PixelColor, PixelColor, PixelColor];
  numeratorValues: [NumeratorSlots, NumeratorSlots, NumeratorSlots];
  userInputs: [string, string, string];
  onInputChange: (index: number, value: string) => void;
  onFillNumeratorSlot: (colIndex: number, channel: 'r' | 'g' | 'b', value: number | null) => void;
  onFillAllNumerators: () => void;
  onClearNumerators: () => void;
}

export const CalculationSection: React.FC<CalculationSectionProps> = ({
  pixels,
  numeratorValues,
  userInputs,
  onInputChange,
  onFillNumeratorSlot,
  onFillAllNumerators,
  onClearNumerators,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-5 bg-indigo-500 rounded-full" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            평균 계산식 <span className="text-xs font-normal text-slate-500">(세 개의 행)</span>
          </h2>
        </div>

        {/* Quick Fill / Clear Buttons for Numerators */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onFillAllNumerators}
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
            title="왼쪽 행렬의 값들을 분자 빈칸에 모두 채웁니다"
          >
            <CheckCheck className="w-3 h-3 text-indigo-600" />
            <span>분자 자동 채우기</span>
          </button>
          <button
            onClick={onClearNumerators}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
            title="분자 빈칸 비우기"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Guide Note Box */}
      <div className="flex items-start gap-2 p-2 mb-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-[11px] text-indigo-900 leading-relaxed">
        <MousePointerClick className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold">계산 순서:</span> 왼쪽 <span className="text-rose-600 font-semibold">R</span>, <span className="text-emerald-700 font-semibold">G</span>, <span className="text-sky-600 font-semibold">B</span> 행렬의 칸을 클릭하여 분자를 채운 후, 등호(=) 오른쪽 빈칸에 계산한 <strong>평균값</strong>을 직접 입력하세요!
        </div>
      </div>

      {/* 3 Rows of Average Calculation */}
      <div className="flex-1 flex flex-col justify-around gap-3 py-1">
        {[0, 1, 2].map((colIdx) => {
          const pixel = pixels[colIdx];
          const pixelHex = pixel ? rgbToHex(pixel.r, pixel.g, pixel.b) : '#ffffff';
          const slots = numeratorValues[colIdx];

          const isRSet = slots.r !== null;
          const isGSet = slots.g !== null;
          const isBSet = slots.b !== null;
          const isAllSet = isRSet && isGSet && isBSet;

          const sum = (slots.r || 0) + (slots.g || 0) + (slots.b || 0);
          const exact = sum / 3;
          const rounded = Math.round(exact);

          const inputValue = userInputs[colIdx];
          const hasInput = inputValue.trim() !== '';
          const numInput = hasInput ? parseInt(inputValue, 10) : NaN;
          const isCorrect = isAllSet && !isNaN(numInput) && numInput === rounded;
          const isIncorrect = isAllSet && !isNaN(numInput) && numInput !== rounded;

          return (
            <div
              key={colIdx}
              className="flex flex-col p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all"
            >
              {/* Row title */}
              <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    행 {colIdx + 1}: {colIdx + 1}열 픽셀 평균
                  </span>
                  {pixel ? (
                    <div
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: pixelHex }}
                      title={`원본 색상: rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-normal">(색상 미지정)</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {colIdx + 1}번째 열
                </span>
              </div>

              {/* Formula Layout:
                  m_1j = [ (R) + (G) + (B) ] / 3 = [ 빈칸 (크기 축소되어 등호 오른쪽에 나란히 배치) ]
              */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1 flex-nowrap overflow-x-auto">
                {/* 1. Component Symbol */}
                <div className="flex items-baseline font-serif text-slate-800 select-none shrink-0">
                  <span className="text-base sm:text-lg font-bold italic">m</span>
                  <span className="text-[10px] font-bold text-slate-600 ml-0.5">1{colIdx + 1}</span>
                </div>

                <span className="text-base sm:text-lg font-light text-slate-400 select-none shrink-0">=</span>

                {/* 2. Fraction */}
                <div className="inline-flex flex-col items-center shrink-0">
                  {/* Numerator: 3 Clickable Blank Slots */}
                  <div className="flex items-center gap-1 px-0.5 py-0.5">
                    {/* R slot */}
                    <button
                      type="button"
                      onClick={() => {
                        if (pixel) {
                          onFillNumeratorSlot(colIdx, 'r', isRSet ? null : pixel.r);
                        }
                      }}
                      className={`min-w-9 px-1 py-0.5 text-xs font-mono font-bold rounded border transition-all ${
                        isRSet
                          ? 'bg-rose-100 text-rose-800 border-rose-400 shadow-2xs'
                          : 'bg-white border-dashed border-rose-300 text-rose-400 hover:border-rose-500'
                      }`}
                      title={
                        pixel
                          ? isRSet
                            ? `클릭하여 비우기 (현재: ${slots.r})`
                            : `왼쪽 R 행렬의 ${pixel.r} 클릭 또는 여기 클릭`
                          : '먼저 원본 이미지 색상을 칠하세요'
                      }
                    >
                      {isRSet ? slots.r : 'R'}
                    </button>

                    <span className="text-slate-400 font-sans text-xs">+</span>

                    {/* G slot */}
                    <button
                      type="button"
                      onClick={() => {
                        if (pixel) {
                          onFillNumeratorSlot(colIdx, 'g', isGSet ? null : pixel.g);
                        }
                      }}
                      className={`min-w-9 px-1 py-0.5 text-xs font-mono font-bold rounded border transition-all ${
                        isGSet
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400 shadow-2xs'
                          : 'bg-white border-dashed border-emerald-300 text-emerald-500 hover:border-emerald-500'
                      }`}
                      title={
                        pixel
                          ? isGSet
                            ? `클릭하여 비우기 (현재: ${slots.g})`
                            : `왼쪽 G 행렬의 ${pixel.g} 클릭 또는 여기 클릭`
                          : '먼저 원본 이미지 색상을 칠하세요'
                      }
                    >
                      {isGSet ? slots.g : 'G'}
                    </button>

                    <span className="text-slate-400 font-sans text-xs">+</span>

                    {/* B slot */}
                    <button
                      type="button"
                      onClick={() => {
                        if (pixel) {
                          onFillNumeratorSlot(colIdx, 'b', isBSet ? null : pixel.b);
                        }
                      }}
                      className={`min-w-9 px-1 py-0.5 text-xs font-mono font-bold rounded border transition-all ${
                        isBSet
                          ? 'bg-sky-100 text-sky-800 border-sky-400 shadow-2xs'
                          : 'bg-white border-dashed border-sky-300 text-sky-500 hover:border-sky-500'
                      }`}
                      title={
                        pixel
                          ? isBSet
                            ? `클릭하여 비우기 (현재: ${slots.b})`
                            : `왼쪽 B 행렬의 ${pixel.b} 클릭 또는 여기 클릭`
                          : '먼저 원본 이미지 색상을 칠하세요'
                      }
                    >
                      {isBSet ? slots.b : 'B'}
                    </button>
                  </div>

                  {/* Horizontal Fraction Bar */}
                  <div className="w-full h-0.5 bg-slate-700 rounded-full my-0.5" />

                  {/* Denominator (3) */}
                  <div className="text-center font-serif font-bold text-xs text-slate-800">
                    3
                  </div>
                </div>

                <span className="text-base sm:text-lg font-light text-slate-400 select-none shrink-0">=</span>

                {/* 3. User Input Box for Calculation Result (등호 오른쪽에 위치하도록 크기 축소) */}
                <div className="relative flex items-center shrink-0">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="—"
                    value={inputValue}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        onInputChange(colIdx, '');
                      } else {
                        const num = Math.min(255, parseInt(val, 10));
                        onInputChange(colIdx, isNaN(num) ? '' : num.toString());
                      }
                    }}
                    className={`w-14 py-1 px-1 text-center font-mono font-bold text-sm rounded-md border-2 shadow-2xs transition-all focus:outline-none ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-300/40'
                        : isIncorrect
                        ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-300/40'
                        : 'bg-white text-slate-800 border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300/40'
                    }`}
                  />

                  {/* Feedback indicator badge */}
                  {isCorrect && (
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  )}
                  {isIncorrect && (
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2" title={`분자 합: ${sum}, 정답: ${rounded}`}>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 mt-auto border-t border-slate-100 text-[10px] text-slate-500 text-center">
        등호(=) 오른쪽 빈칸에 계산 결과를 입력하면 오른쪽 <span className="font-bold text-slate-800">결과 이미지 B'</span>와 실시간 연동됩니다
      </div>
    </div>
  );
};
