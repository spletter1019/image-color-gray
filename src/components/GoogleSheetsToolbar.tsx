import React, { useState, useRef, useEffect } from 'react';
import {
  PaintBucket,
  ChevronDown,
  Check,
  Plus,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { PixelColor, RGB } from '../types';
import {
  GOOGLE_SHEETS_PALETTE,
  TEXTBOOK_PAGE_94_PIXELS,
  rgbToHex,
  hexToRgb,
} from '../utils/colorUtils';

interface GoogleSheetsToolbarProps {
  pixels: [PixelColor, PixelColor, PixelColor];
  selectedCell: number; // 0, 1, 2, or -1 for all
  onSelectCell: (index: number) => void;
  onUpdatePixelColor: (index: number, newColor: RGB) => void;
  onUpdateAllPixels: (newColor: RGB) => void;
  onClearToBlank: () => void;
  onApplyTextbookExample: () => void;
  onOpenTextbookGuide: () => void;
}

export const GoogleSheetsToolbar: React.FC<GoogleSheetsToolbarProps> = ({
  pixels,
  selectedCell,
  onSelectCell,
  onUpdatePixelColor,
  onUpdateAllPixels,
  onClearToBlank,
  onApplyTextbookExample,
  onOpenTextbookGuide,
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#1a73e8');
  const [applyToAll, setApplyToAll] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
    }
    if (isColorPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPickerOpen]);

  const activePixel = selectedCell >= 0 ? pixels[selectedCell] : pixels[0];
  const activeHex = activePixel ? rgbToHex(activePixel.r, activePixel.g, activePixel.b) : '#ffffff';

  const handleColorSelect = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    if (applyToAll || selectedCell === -1) {
      onUpdateAllPixels(rgb);
    } else {
      onUpdatePixelColor(selectedCell, rgb);
    }
  };

  const cellName = selectedCell === -1 ? 'A1:C1' : `${String.fromCharCode(65 + selectedCell)}1`;

  return (
    <header className="w-full bg-[#f8f9fa] border-b border-[#dadce0] select-none text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#0F9D58] text-white shadow-xs font-bold text-sm">
            田
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span>구글 시트 컬러 이미지 회색조 변환 실습</span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                교과서 94쪽
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              구글 시트 채우기 색상으로 1×3 원본 이미지를 색칠하고 평균 계산식을 완성하세요
            </p>
          </div>
        </div>

        {/* Center/Right: (1) ONLY Google Sheets Fill Color Feature + Quick controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Target Cell Selector */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 px-2">채울 셀:</span>
            {[0, 1, 2].map((idx) => {
              const isSelected = selectedCell === idx && !applyToAll;
              const p = pixels[idx];
              const hex = p ? rgbToHex(p.r, p.g, p.b) : '#ffffff';
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setApplyToAll(false);
                    onSelectCell(idx);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full border ${
                      p ? 'border-black/20' : 'border-dashed border-slate-400 bg-white'
                    }`}
                    style={{ backgroundColor: p ? hex : undefined }}
                  />
                  <span>{String.fromCharCode(65 + idx)}1 ({idx + 1}열)</span>
                </button>
              );
            })}
          </div>

          {/* (1) The Google Sheets Fill Color Feature (채우기 색상) */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition shadow-xs ${
                isColorPickerOpen
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/40'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
              }`}
              title="구글 시트 채우기 색상 열기"
            >
              <div className="flex flex-col items-center">
                <PaintBucket className="w-4 h-4 text-slate-800" />
                <span
                  className="w-4 h-1 rounded-xs mt-0.5 border border-black/20"
                  style={{ backgroundColor: activeHex }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800">채우기 색상</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Google Sheets Theme Palette Popover */}
            {isColorPickerOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-50 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-3.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <PaintBucket className="w-4 h-4 text-emerald-600" />
                    채우기 색상 선택
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    {applyToAll ? '전체 셀' : `${cellName} 셀`}
                  </span>
                </div>

                {/* Target Scope Switch */}
                <div className="grid grid-cols-2 gap-1 mb-2.5 text-xs">
                  <button
                    onClick={() => setApplyToAll(false)}
                    className={`py-1 rounded border text-center transition ${
                      !applyToAll
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    선택 셀({cellName})만 적용
                  </button>
                  <button
                    onClick={() => setApplyToAll(true)}
                    className={`py-1 rounded border text-center transition ${
                      applyToAll
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    3개 전체 셀 적용
                  </button>
                </div>

                {/* Reset to Blank */}
                <button
                  onClick={() => {
                    if (applyToAll || selectedCell === -1) {
                      onClearToBlank();
                    } else {
                      onUpdatePixelColor(selectedCell, { r: 255, g: 255, b: 255 });
                    }
                  }}
                  className="w-full mb-2 py-1 px-2 text-xs text-left rounded hover:bg-slate-100 text-slate-700 flex items-center justify-between border border-dashed border-slate-300"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-300 bg-white" />
                    색상 재설정 (흰색)
                  </span>
                  <span className="text-[10px] text-slate-400">#FFFFFF</span>
                </button>

                {/* Google Sheets Theme Palette Grid */}
                <div className="text-[11px] font-semibold text-slate-500 mb-1">표준 색상표:</div>
                <div className="grid grid-cols-10 gap-1 p-1 bg-slate-50 rounded-lg border border-slate-200 mb-2.5">
                  {GOOGLE_SHEETS_PALETTE.map((row, rIdx) =>
                    row.map((color, cIdx) => {
                      const isCurrent = activeHex.toLowerCase() === color.toLowerCase();
                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => handleColorSelect(color)}
                          className={`w-5 h-5 rounded-xs transition-transform hover:scale-115 hover:z-10 relative flex items-center justify-center border ${
                            color === '#ffffff' ? 'border-slate-300' : 'border-black/10'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {isCurrent && (
                            <Check
                              className={`w-3 h-3 ${
                                rIdx >= 4 || cIdx === 0 || cIdx === 1 ? 'text-white' : 'text-black'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Textbook 94p Quick Preset Colors */}
                <div className="mb-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                    <span>교과서 94쪽 색상 불러오기:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TEXTBOOK_PAGE_94_PIXELS.map((p, idx) => {
                      const hex = rgbToHex(p.r, p.g, p.b);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleColorSelect(hex)}
                          className="flex flex-col items-center p-1 rounded border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition text-left"
                        >
                          <div
                            className="w-full h-4 rounded-xs border border-black/15 shadow-2xs mb-0.5"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-[9px] font-bold text-slate-700">
                            {idx + 1}열 ({p.r},{p.g},{p.b})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Picker */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <label className="text-xs text-slate-600 flex items-center gap-1.5 cursor-pointer">
                    <div className="relative">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          handleColorSelect(e.target.value);
                        }}
                        className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                      />
                      <div
                        className="w-6 h-6 rounded border border-slate-300 shadow-2xs flex items-center justify-center"
                        style={{ backgroundColor: customColor }}
                      >
                        <Plus className="w-3.5 h-3.5 text-white drop-shadow" />
                      </div>
                    </div>
                    <span className="font-medium text-slate-700">사용자 지정 색상...</span>
                  </label>
                  <input
                    type="text"
                    value={activeHex.toUpperCase()}
                    onChange={(e) => {
                      if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                        handleColorSelect(e.target.value);
                      }
                    }}
                    className="w-20 px-1.5 py-0.5 text-xs font-mono text-center uppercase bg-slate-100 border border-slate-300 rounded focus:bg-white focus:outline-emerald-500"
                    maxLength={7}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Textbook 94p Fill Button */}
          <button
            onClick={onApplyTextbookExample}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
            title="교과서 94쪽 기본 예제 색상으로 3칸을 즉시 채웁니다"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>94쪽 예제 채우기</span>
          </button>

          {/* Blank Reset Button */}
          <button
            onClick={onClearToBlank}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 transition shadow-2xs"
            title="원본 이미지를 모두 빈칸으로 만듭니다"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>빈칸으로 초기화</span>
          </button>

          {/* Concept Guide Button */}
          <button
            onClick={onOpenTextbookGuide}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">교과서 개념</span>
          </button>
        </div>
      </div>
    </header>
  );
};
