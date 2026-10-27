import React, { useState } from 'react';
import { X, BookOpen, Lightbulb } from 'lucide-react';
import { PixelColor, RGB } from '../types';
import { calculateLuma, TEXTBOOK_PAGE_94_PIXELS } from '../utils/colorUtils';

interface TextbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixels: [PixelColor, PixelColor, PixelColor];
  onApplyTextbookExample: () => void;
}

export const TextbookModal: React.FC<TextbookModalProps> = ({
  isOpen,
  onClose,
  pixels,
  onApplyTextbookExample,
}) => {
  const [activeTab, setActiveTab] = useState<'average' | 'luma'>('average');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-100" />
            <div>
              <h3 className="font-bold text-base leading-tight">
                인공지능 수학 교과서 94쪽 개념 정리
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                4. 행렬의 연산을 이용한 컬러 이미지의 회색조 이미지로의 색 변환
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-700/80 transition text-emerald-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('average')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'average'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            기본: 산술 평균값 변환 (실습 내용)
          </button>
          <button
            onClick={() => setActiveTab('luma')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'luma'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            심화: 가중치 반영 변환 (Luma 공식)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
          {activeTab === 'average' ? (
            <>
              {/* Concept 1 */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>수학적 원리</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  컬러 이미지는 한 픽셀당 <strong>R(빨강), G(초록), B(파랑)</strong> 3개의 행렬로 표현되는 반면,
                  회색조(Grayscale) 이미지는 <strong>명암을 나타내는 1개의 행렬</strong>로 표현됩니다.
                  따라서 가장 간단하고 직관적인 변환 방법은 한 픽셀의 세 색상 성분 값의 <strong>산술 평균</strong>을 구하는 것입니다.
                </p>
                <div className="p-2 bg-white rounded-lg border border-emerald-200 font-mono text-center text-xs font-bold text-emerald-950">
                  m_1j = round( ( R_1j + G_1j + B_1j ) / 3 )
                </div>
              </div>

              {/* Textbook Example Details */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">
                    교과서 94쪽 1×3 행렬 예제 풀이
                  </span>
                  <button
                    onClick={() => {
                      onApplyTextbookExample();
                      onClose();
                    }}
                    className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                  >
                    이 예제 불러오기
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-rose-600 font-bold block mb-1">R 행렬 (1×3)</span>
                    ( 118 &nbsp; 144 &nbsp; 120 )
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-emerald-700 font-bold block mb-1">G 행렬 (1×3)</span>
                    ( 209 &nbsp; 211 &nbsp; 62 )
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-sky-600 font-bold block mb-1">B 행렬 (1×3)</span>
                    ( 117 &nbsp; 248 &nbsp; 148 )
                  </div>
                </div>

                {/* Calculations */}
                <div className="space-y-1.5 text-xs font-mono bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>m₁₁ = (118 + 209 + 117) / 3 = 444 / 3</span>
                    <span className="font-bold text-indigo-700">= 148</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>m₁₂ = (144 + 211 + 248) / 3 = 603 / 3</span>
                    <span className="font-bold text-indigo-700">= 201</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>m₁₃ = (120 + 62 + 148) / 3 = 330 / 3</span>
                    <span className="font-bold text-indigo-700">= 110</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-sans">
                  💡 <strong>결과 회색조 행렬 B:</strong> ( 148 &nbsp; 201 &nbsp; 110 )
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Luma Theory */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-sm">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>인간의 시각 특성을 고려한 Luma 가중치 변환</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  인간의 눈은 빨강, 초록, 파랑을 똑같은 정도로 인식하지 않습니다.
                  <strong>초록색(G)</strong>에 가장 민감하고, <strong>파란색(B)</strong>에 덜 민감합니다.
                  따라서 방송 및 컴퓨터 그래픽스(ITU-R BT.601)에서는 다음과 같이 가중치를 부여합니다:
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-blue-200 font-mono text-center text-xs font-bold text-blue-950">
                  L = 0.299·R + 0.587·G + 0.114·B
                </div>
              </div>

              {/* Luma calculations for current pixels */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
                <span className="font-bold text-slate-800 text-xs block">
                  현재 화면의 3개 픽셀에 Luma 가중 공식 적용 시:
                </span>
                <div className="space-y-2 font-mono text-xs">
                  {pixels.map((rawP, idx) => {
                    const p = rawP || TEXTBOOK_PAGE_94_PIXELS[idx];
                    const luma = calculateLuma(p);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>{idx + 1}열 픽셀: R={p.r}, G={p.g}, B={p.b}</span>
                          <span className="font-bold text-blue-700">L ≈ {luma.rounded}</span>
                        </div>
                        <div className="text-[11px] text-slate-700 truncate">
                          0.299×{p.r} + 0.587×{p.g} + 0.114×{p.b} = {luma.exact.toFixed(3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-slate-100 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
