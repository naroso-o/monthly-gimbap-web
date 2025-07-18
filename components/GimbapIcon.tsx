export function GimbapIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        {/* 김밥 외곽 - 더 심플하게 */}
        <circle cx="16" cy="16" r="14" fill="#8B7355" stroke="#6B5B47" strokeWidth="1" />
        {/* 밥 */}
        <circle cx="16" cy="16" r="11" fill="#F5F1EB" />
        {/* 속재료들 - 더 심플하고 적게 */}
        <circle cx="13" cy="13" r="1.5" fill="#D4A574" />
        <circle cx="19" cy="15" r="1" fill="#A67C52" />
        <circle cx="15" cy="19" r="1" fill="#E6B887" />
        <circle cx="18" cy="18" r="0.8" fill="#C19A6B" />
      </svg>
    </div>
  )
}
