// components/KimbapIcon.tsx
import React from 'react';
import type { KimbapIconProps } from '../types';

const KimbapIcon: React.FC<KimbapIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 김밥 외부 (김) */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#2D5016"
        stroke="#1A3009"
        strokeWidth="2"
      />
      
      {/* 김밥 내부 속재료들 */}
      {/* 단무지 (노란색) */}
      <circle cx="8" cy="10" r="1.5" fill="#F5D916" />
      <circle cx="16" cy="14" r="1.2" fill="#F5D916" />
      
      {/* 당근 (주황색) */}
      <circle cx="10" cy="14" r="1" fill="#FF8C42" />
      <circle cx="15" cy="9" r="0.8" fill="#FF8C42" />
      
      {/* 계란 (흰색+노란색) */}
      <ellipse cx="14" cy="12" rx="1.2" ry="0.8" fill="#FFF8DC" />
      <ellipse cx="14" cy="12" rx="0.6" ry="0.4" fill="#FFE135" />
      
      {/* 시금치 (초록색) */}
      <circle cx="9" cy="12" r="0.7" fill="#4A7C59" />
      <circle cx="12" cy="15" r="0.9" fill="#4A7C59" />
      
      {/* 소고기 (갈색) */}
      <circle cx="12" cy="9" r="1" fill="#8B4513" />
      
      {/* 밥 (흰색 점들) */}
      <circle cx="11" cy="11" r="0.3" fill="#F8F8FF" />
      <circle cx="13" cy="13" r="0.3" fill="#F8F8FF" />
      <circle cx="10" cy="13" r="0.2" fill="#F8F8FF" />
      <circle cx="14" cy="10" r="0.2" fill="#F8F8FF" />
      <circle cx="8" cy="12" r="0.2" fill="#F8F8FF" />
      <circle cx="16" cy="11" r="0.2" fill="#F8F8FF" />
    </svg>
  );
};

export default KimbapIcon;