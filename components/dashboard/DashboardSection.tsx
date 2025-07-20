"use client";
import { useCurrentPeriodQuery } from "../../remote/period";
import { Dashboard } from "./Dashboard";
import { DashboardCalendar } from "./DashboardCalendar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMembers } from "./DashboardMembers";
import { DashboardQuickMenu } from "./DashboardQuickMenu";
import { useEffect, useRef, useState } from "react";

export const DashboardSection = () => {
  const { data: currentPeriod } = useCurrentPeriodQuery();
  
  // 각 섹션에 대한 ref
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const dashboardSectionRef = useRef<HTMLDivElement>(null);
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sections = [headerSectionRef, dashboardSectionRef, bottomSectionRef];
  
  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg 브레이크포인트 기준
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  useEffect(() => {
    // 모바일에서는 섹션 기반 스크롤 비활성화
    if (isMobile) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      e.preventDefault();
      
      let nextSection = currentSection;
      
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        // 아래로 스크롤
        nextSection = currentSection + 1;
      } else if (e.deltaY < 0 && currentSection > 0) {
        // 위로 스크롤
        nextSection = currentSection - 1;
      }
      
      if (nextSection !== currentSection) {
        setIsScrolling(true);
        setCurrentSection(nextSection);
        
        const targetSection = sections[nextSection].current;
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // 스크롤 완료 후 플래그 해제
          setTimeout(() => {
            setIsScrolling(false);
          }, 800);
        }
      }
    };
    
    // Intersection Observer로 현재 섹션 감지
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionIndex = sections.findIndex(
              (ref) => ref.current === entry.target
            );
            if (sectionIndex !== -1 && sectionIndex !== currentSection) {
              setCurrentSection(sectionIndex);
            }
          }
        });
      },
      {
        threshold: [0.5],
        rootMargin: '-10% 0px -10% 0px'
      }
    );
    
    // 각 섹션을 observer에 등록
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    // 휠 이벤트 등록
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection, isScrolling, sections, isMobile]);

  return (
    <div className={`min-h-screen bg-diary-bg ${!isMobile ? 'overflow-hidden' : ''}`} style={{ scrollBehavior: 'smooth' }}>
      <div className="relative z-10 max-w-md mx-auto lg:max-w-4xl">
        {/* 첫 번째 섹션: Header + QuickMenu */}
        <div 
          ref={headerSectionRef}
          className={`${isMobile ? 'min-h-screen py-8' : 'min-h-screen'} flex flex-col justify-center p-4`}
        >
          <div className="flex flex-col gap-4">
            <DashboardHeader />
            <DashboardQuickMenu />
          </div>
        </div>
        
        {/* 두 번째 섹션: Dashboard */}
        <div 
          ref={dashboardSectionRef}
          className={`${isMobile ? 'min-h-screen py-8' : 'min-h-screen'} flex flex-col justify-center p-4`}
        >
          <Dashboard periodId={currentPeriod?.id || ""} />
        </div>
        
        {/* 세 번째 섹션: Calendar + Members */}
        <div 
          ref={bottomSectionRef}
          className={`${isMobile ? 'min-h-screen py-8' : 'min-h-screen'} flex flex-col justify-center p-4`}
        >
          <div className="w-full grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardCalendar periodId={currentPeriod?.id || ""} />
            <DashboardMembers />
          </div>
        </div>
        
        {/* 섹션 인디케이터 - 데스크톱에서만 표시 */}
        {!isMobile && (
          <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSection(index);
                  const targetSection = sections[index].current;
                  if (targetSection) {
                    targetSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSection === index 
                    ? 'bg-diary-accent scale-125' 
                    : 'bg-diary-border hover:bg-diary-muted'
                }`}
                aria-label={`섹션 ${index + 1}로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
