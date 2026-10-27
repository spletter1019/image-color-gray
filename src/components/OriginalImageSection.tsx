import React from 'react';
import { PixelColor, RGB } from '../types';
import { rgbToHex, getContrastYIQ } from '../utils/colorUtils';
import { PaintBucket, MousePointerClick, Check } from 'lucide-react';

interface OriginalImageSectionProps {
  pixels: [PixelColor, PixelColor, PixelColor];
  selectedCell: number;
  onSelectCell: (index: number) => void;
  onMatrixCellClick: (channel: 'r' | 'g' | 'b', colIndex: number, value: number) => void;
  numeratorValues: [
    { r: number | null; g: number | null; b: number | null },
    { r: number | null; g: number | null; b: number | null },
    { r: number | null; g: number | null; b: number | null }
  ];
}

export const OriginalImageSection: React.FC<OriginalImageSectionProps> = ({
  pixels,
  selectedCell,
  onSelectCell,
  onMatrixCellClick,
  numeratorValues,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-5 bg-rose-500 rounded-full" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            원본 이미지 A <span className="text-xs font-normal text-slate-500">(1행 3열)</span>
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          <PaintBucket className="w-3 h-3 text-blue-600" />
          <span>위쪽 채우기 색상으로 칠하기</span>
        </div>
      </div>

      {/* 1. (2) Original Image Half Size (축소된 크기) & Blank Cells (빈칸) */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>컬러 픽셀 뷰 (반으로 축소)</span>
          <span className="text-[10px] font-mono text-slate-400">클릭하여 선택 후 색상 채우기</span>
        </div>

        {/* 3 Pixels in 1 Row - Half Size (h-14 approx 56px) */}
        <div className="grid grid-cols-3 gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
          {pixels.map((rgb, idx) => {
            const isFilled = rgb !== null;
            const hex = isFilled ? rgbToHex(rgb.r, rgb.g, rgb.b) : '#ffffff';
            const contrast = isFilled ? getContrastYIQ(rgb.r, rgb.g, rgb.b) : 'black';
            const isSelected = selectedCell === idx;
            const colName = `${String.fromCharCode(65 + idx)}1`;

            return (
              <div
                key={idx}
                onClick={() => onSelectCell(idx)}
                className={`relative group cursor-pointer transition-all duration-150 flex flex-col rounded-lg overflow-hidden border-2 ${
                  isSelected
                    ? 'border-blue-600 ring-3 ring-blue-500/30 shadow-md'
                    : isFilled
                    ? 'border-slate-300 hover:border-slate-400 shadow-2xs'
                    : 'border-dashed border-slate-300 hover:border-blue-400 bg-white'
                }`}
              >
                {/* Cell coordinate tag */}
                <div className="absolute top-1 left-1.5 z-10">
                  <span
                    className={`text-[9px] font-mono font-bold px-1 rounded ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isFilled
                        ? contrast === 'white'
                          ? 'bg-black/50 text-white'
                          : 'bg-white/90 text-slate-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {colName}
                  </span>
                </div>

                {/* Reduced Height Pixel Swatch (반으로 축소: h-14) */}
                <div
                  className="h-14 w-full flex flex-col items-center justify-center p-1 text-center transition-colors relative"
                  style={{ backgroundColor: isFilled ? hex : undefined }}
                >
                  {isFilled ? (
                    <>
                      <div
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs ${
                          contrast === 'white' ? 'bg-black/40 text-white' : 'bg-white/80 text-black'
                        }`}
                      >
                        ({rgb.r}, {rgb.g}, {rgb.b})
                      </div>
                      <div
                        className={`text-[9px] font-mono ${
                          contrast === 'white' ? 'text-white/80' : 'text-black/80'
                        }`}
                      >
                        {hex.toUpperCase()}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 text-center">
                      <PaintBucket className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition mb-0.5" />
                      <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-600">
                        {isSelected ? '색상 선택 대기' : '빈칸 (선택)'}
                      </span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-full shadow-2xs">
                      선택
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. (3) R, G, B Matrices with Interactive Click-to-Transfer to Numerator */}
      <div className="mt-auto">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800">R, G, B 행렬</span>
            <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
              칸 클릭 시 분자에 값 입력
            </span>
          </div>
          <span className="text-[10px] text-slate-400">1×3 행렬</span>
        </div>

        {/* Matrix Container */}
        <div className="space-y-2.5 p-3 bg-slate-50/90 rounded-xl border border-slate-200">
          {/* R Matrix Row */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-rose-100 text-rose-700 font-serif font-bold text-xs border border-rose-300">
                R
              </span>
            </div>
            <span className="text-slate-400 font-serif text-base font-light">=</span>

            <div className="flex-1 flex items-center relative">
              <span className="text-2xl font-light text-slate-400 select-none mr-1">(</span>
              <div className="grid grid-cols-3 gap-2 flex-1">
                {pixels.map((p, colIdx) => {
                  const val = p ? p.r : null;
                  const isEnteredInNum = numeratorValues[colIdx].r === val && val !== null;

                  return (
                    <button
                      key={colIdx}
                      type="button"
                      disabled={val === null}
                      onClick={() => val !== null && onMatrixCellClick('r', colIdx, val)}
                      className={`relative flex items-center justify-center py-1.5 px-1 rounded border transition-all text-xs font-mono font-bold ${
                        val === null
                          ? 'bg-slate-100 border-dashed border-slate-300 text-slate-400 cursor-not-allowed'
                          : isEnteredInNum
                          ? 'bg-rose-50 border-rose-400 text-rose-700 ring-1 ring-rose-300'
                          : 'bg-white border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 text-rose-700 hover:scale-105 shadow-2xs cursor-pointer'
                      }`}
                      title={
                        val !== null
                          ? `클릭하여 ${colIdx + 1}열 평균식 분자의 R 칸에 ${val} 입력`
                          : '먼저 상단 채우기 색상으로 색을 칠하세요'
                      }
                    >
                      <span>{val !== null ? val : '—'}</span>
                      {isEnteredInNum && (
                        <Check className="w-2.5 h-2.5 text-rose-600 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-2xl font-light text-slate-400 select-none ml-1">)</span>
            </div>
          </div>

          {/* G Matrix Row */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-100 text-emerald-800 font-serif font-bold text-xs border border-emerald-300">
                G
              </span>
            </div>
            <span className="text-slate-400 font-serif text-base font-light">=</span>

            <div className="flex-1 flex items-center relative">
              <span className="text-2xl font-light text-slate-400 select-none mr-1">(</span>
              <div className="grid grid-cols-3 gap-2 flex-1">
                {pixels.map((p, colIdx) => {
                  const val = p ? p.g : null;
                  const isEnteredInNum = numeratorValues[colIdx].g === val && val !== null;

                  return (
                    <button
                      key={colIdx}
                      type="button"
                      disabled={val === null}
                      onClick={() => val !== null && onMatrixCellClick('g', colIdx, val)}
                      className={`relative flex items-center justify-center py-1.5 px-1 rounded border transition-all text-xs font-mono font-bold ${
                        val === null
                          ? 'bg-slate-100 border-dashed border-slate-300 text-slate-400 cursor-not-allowed'
                          : isEnteredInNum
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-1 ring-emerald-300'
                          : 'bg-white border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-800 hover:scale-105 shadow-2xs cursor-pointer'
                      }`}
                      title={
                        val !== null
                          ? `클릭하여 ${colIdx + 1}열 평균식 분자의 G 칸에 ${val} 입력`
                          : '먼저 상단 채우기 색상으로 색을 칠하세요'
                      }
                    >
                      <span>{val !== null ? val : '—'}</span>
                      {isEnteredInNum && (
                        <Check className="w-2.5 h-2.5 text-emerald-600 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-2xl font-light text-slate-400 select-none ml-1">)</span>
            </div>
          </div>

          {/* B Matrix Row */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-sky-100 text-sky-800 font-serif font-bold text-xs border border-sky-300">
                B
              </span>
            </div>
            <span className="text-slate-400 font-serif text-base font-light">=</span>

            <div className="flex-1 flex items-center relative">
              <span className="text-2xl font-light text-slate-400 select-none mr-1">(</span>
              <div className="grid grid-cols-3 gap-2 flex-1">
                {pixels.map((p, colIdx) => {
                  const val = p ? p.b : null;
                  const isEnteredInNum = numeratorValues[colIdx].b === val && val !== null;

                  return (
                    <button
                      key={colIdx}
                      type="button"
                      disabled={val === null}
                      onClick={() => val !== null && onMatrixCellClick('b', colIdx, val)}
                      className={`relative flex items-center justify-center py-1.5 px-1 rounded border transition-all text-xs font-mono font-bold ${
                        val === null
                          ? 'bg-slate-100 border-dashed border-slate-300 text-slate-400 cursor-not-allowed'
                          : isEnteredInNum
                          ? 'bg-sky-50 border-sky-400 text-sky-800 ring-1 ring-sky-300'
                          : 'bg-white border-sky-200 hover:border-sky-500 hover:bg-sky-50/50 text-sky-800 hover:scale-105 shadow-2xs cursor-pointer'
                      }`}
                      title={
                        val !== null
                          ? `클릭하여 ${colIdx + 1}열 평균식 분자의 B 칸에 ${val} 입력`
                          : '먼저 상단 채우기 색상으로 색을 칠하세요'
                      }
                    >
                      <span>{val !== null ? val : '—'}</span>
                      {isEnteredInNum && (
                        <Check className="w-2.5 h-2.5 text-sky-600 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-2xl font-light text-slate-400 select-none ml-1">)</span>
            </div>
          </div>
        </div>

        {/* Matrix column guide */}
        <div className="flex justify-between items-center px-8 pt-1 text-[9px] font-mono text-slate-400">
          <span className="w-16 text-center">1열 (A1)</span>
          <span className="w-16 text-center">2열 (B1)</span>
          <span className="w-16 text-center">3열 (C1)</span>
        </div>
      </div>
    </div>
  );
};
