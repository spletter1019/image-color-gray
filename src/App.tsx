import React, { useState } from 'react';
import { PixelColor, RGB, NumeratorSlots } from './types';
import {
  TEXTBOOK_PAGE_94_PIXELS,
  calculateAverageGrayscale,
} from './utils/colorUtils';
import { GoogleSheetsToolbar } from './components/GoogleSheetsToolbar';
import { OriginalImageSection } from './components/OriginalImageSection';
import { CalculationSection } from './components/CalculationSection';
import { GrayscaleSection } from './components/GrayscaleSection';
import { TextbookModal } from './components/TextbookModal';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // (2) Pixels start as blank (null) so they can be filled using the top Fill Color tool
  const [pixels, setPixels] = useState<[PixelColor, PixelColor, PixelColor]>([
    null,
    null,
    null,
  ]);

  // Active selected cell (0 = A1, 1 = B1, 2 = C1, -1 = all)
  const [selectedCell, setSelectedCell] = useState<number>(0);

  // (3) Numerator blank slots in the average calculations
  const [numeratorValues, setNumeratorValues] = useState<[NumeratorSlots, NumeratorSlots, NumeratorSlots]>([
    { r: null, g: null, b: null },
    { r: null, g: null, b: null },
    { r: null, g: null, b: null },
  ]);

  // (4) User input values for 1x3 matrix B'
  const [userInputs, setUserInputs] = useState<[string, string, string]>(['', '', '']);

  // Textbook modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Update a single pixel color (from Google Sheets Fill Color)
  const handleUpdatePixelColor = (index: number, newColor: RGB) => {
    setPixels((prev) => {
      const copy: [PixelColor, PixelColor, PixelColor] = [...prev];
      copy[index] = newColor;
      return copy;
    });

    // Reset numerator slot if the pixel color changes to keep it fresh
    setNumeratorValues((prev) => {
      const copy: [NumeratorSlots, NumeratorSlots, NumeratorSlots] = [
        { ...prev[0] },
        { ...prev[1] },
        { ...prev[2] },
      ];
      copy[index] = { r: null, g: null, b: null };
      return copy;
    });
  };

  // Update all pixels at once
  const handleUpdateAllPixels = (newColor: RGB) => {
    setPixels([{ ...newColor }, { ...newColor }, { ...newColor }]);
    setNumeratorValues([
      { r: null, g: null, b: null },
      { r: null, g: null, b: null },
      { r: null, g: null, b: null },
    ]);
  };

  // (3) Matrix cell click handler: clicks in R, G, B matrix link to numerator slots
  const handleMatrixCellClick = (channel: 'r' | 'g' | 'b', colIndex: number, value: number) => {
    setNumeratorValues((prev) => {
      const copy: [NumeratorSlots, NumeratorSlots, NumeratorSlots] = [
        { ...prev[0] },
        { ...prev[1] },
        { ...prev[2] },
      ];
      copy[colIndex][channel] = value;
      return copy;
    });
  };

  // Individual numerator slot toggle/edit
  const handleFillNumeratorSlot = (colIndex: number, channel: 'r' | 'g' | 'b', value: number | null) => {
    setNumeratorValues((prev) => {
      const copy: [NumeratorSlots, NumeratorSlots, NumeratorSlots] = [
        { ...prev[0] },
        { ...prev[1] },
        { ...prev[2] },
      ];
      copy[colIndex][channel] = value;
      return copy;
    });
  };

  // Fill all numerators from existing pixel colors
  const handleFillAllNumerators = () => {
    setNumeratorValues((prev) => {
      const copy: [NumeratorSlots, NumeratorSlots, NumeratorSlots] = [
        { ...prev[0] },
        { ...prev[1] },
        { ...prev[2] },
      ];
      pixels.forEach((p, idx) => {
        if (p) {
          copy[idx] = { r: p.r, g: p.g, b: p.b };
        }
      });
      return copy;
    });
  };

  // Clear numerators
  const handleClearNumerators = () => {
    setNumeratorValues([
      { r: null, g: null, b: null },
      { r: null, g: null, b: null },
      { r: null, g: null, b: null },
    ]);
  };

  // (2) Clear all to blank
  const handleClearToBlank = () => {
    setPixels([null, null, null]);
    handleClearNumerators();
    setUserInputs(['', '', '']);
    setSelectedCell(0);
  };

  // Apply Textbook Page 94 example
  const handleApplyTextbookExample = () => {
    setPixels([
      { ...TEXTBOOK_PAGE_94_PIXELS[0] },
      { ...TEXTBOOK_PAGE_94_PIXELS[1] },
      { ...TEXTBOOK_PAGE_94_PIXELS[2] },
    ]);
    handleClearNumerators();
    setUserInputs(['', '', '']);
    setSelectedCell(0);
  };

  // Handle user inputs in B' matrix
  const handleInputChange = (index: number, value: string) => {
    setUserInputs((prev) => {
      const copy: [string, string, string] = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Auto fill answers from calculation
  const handleAutoFill = () => {
    const answers = pixels.map((p) => {
      if (p) return calculateAverageGrayscale(p).rounded.toString();
      return '';
    });
    setUserInputs([answers[0], answers[1], answers[2]]);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f4] text-slate-900 flex flex-col font-sans">
      {/* (1) Google Sheets Fill Color Toolbar ONLY */}
      <GoogleSheetsToolbar
        pixels={pixels}
        selectedCell={selectedCell}
        onSelectCell={setSelectedCell}
        onUpdatePixelColor={handleUpdatePixelColor}
        onUpdateAllPixels={handleUpdateAllPixels}
        onClearToBlank={handleClearToBlank}
        onApplyTextbookExample={handleApplyTextbookExample}
        onOpenTextbookGuide={() => setIsModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        {/* Step Guide Bar */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              실습 순서
            </span>
            <span className="font-medium text-slate-700">1. 상단 <strong>채우기 색상</strong>으로 1×3 원본 셀 칠하기</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">2. 왼쪽 <strong>R,G,B 행렬 칸 클릭</strong>하여 분자 채우기</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">3. 오른쪽 <strong>결과 행렬 B'</strong>에 값 입력</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-emerald-700">4. 실시간 회색조 확인!</span>
          </div>

          <button
            onClick={handleApplyTextbookExample}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>교과서 94쪽 값으로 바로 채우기</span>
          </button>
        </div>

        {/* 3-Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          {/* (2) Left Section (4 cols): Original Image (half-size, blank) + R,G,B Matrix */}
          <div className="lg:col-span-4 flex flex-col">
            <OriginalImageSection
              pixels={pixels}
              selectedCell={selectedCell}
              onSelectCell={setSelectedCell}
              onMatrixCellClick={handleMatrixCellClick}
              numeratorValues={numeratorValues}
            />
          </div>

          {/* (3) Center Section (4 cols): Average Formulas with Blank Numerators and Input Result Box */}
          <div className="lg:col-span-4 flex flex-col">
            <CalculationSection
              pixels={pixels}
              numeratorValues={numeratorValues}
              userInputs={userInputs}
              onInputChange={handleInputChange}
              onFillNumeratorSlot={handleFillNumeratorSlot}
              onFillAllNumerators={handleFillAllNumerators}
              onClearNumerators={handleClearNumerators}
            />
          </div>

          {/* (4, 5) Right Section (4 cols): 결과 이미지 B' (Top: Input Matrix, Bottom: Realtime Grayscale View) */}
          <div className="lg:col-span-4 flex flex-col">
            <GrayscaleSection
              pixels={pixels}
              userInputs={userInputs}
              onInputChange={handleInputChange}
              onAutoFill={handleAutoFill}
              onClearInputs={() => setUserInputs(['', '', ''])}
            />
          </div>
        </div>
      </main>

      {/* Textbook Reference Modal */}
      <TextbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pixels={pixels}
        onApplyTextbookExample={handleApplyTextbookExample}
      />
    </div>
  );
}
