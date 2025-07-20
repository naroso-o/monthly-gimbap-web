"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"

interface Member {
  id: string
  name: string
  completedTasks: number
  totalTasks: number
  isOnline: boolean
  lastActive: string
}

// 더미 멤버 데이터
const mockMembers: Member[] = [
  {
    id: "1",
    name: "나소현",
    completedTasks: 0,
    totalTasks: 3,
    isOnline: true,
    lastActive: "방금 전",
  },
  {
    id: "2",
    name: "김개발",
    completedTasks: 2,
    totalTasks: 3,
    isOnline: true,
    lastActive: "5분 전",
  },
  {
    id: "3",
    name: "이코딩",
    completedTasks: 1,
    totalTasks: 3,
    isOnline: false,
    lastActive: "2시간 전",
  },
  {
    id: "4",
    name: "박스터디",
    completedTasks: 3,
    totalTasks: 3,
    isOnline: false,
    lastActive: "1일 전",
  },
  {
    id: "5",
    name: "최블로그",
    completedTasks: 1,
    totalTasks: 3,
    isOnline: true,
    lastActive: "30분 전",
  },
]

export const DashboardMembers = () => {
  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100)
  }

  const getCompletionColor = (rate: number) => {
    if (rate === 100) return "var(--diary-accent)"
    if (rate >= 66) return "#A67C52"
    if (rate >= 33) return "#D4A574"
    return "var(--diary-muted)"
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-diary-text text-sm">멤버 현황</h3>
          <Badge variant="outline" className="text-xs">
            {mockMembers.length}명
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {mockMembers.map((member) => {
            const completionRate = getCompletionRate(member.completedTasks, member.totalTasks)

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-diary-border/20"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* 온라인 상태 표시 */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-diary-border flex items-center justify-center">
                      <span className="text-xs font-medium text-diary-text">{member.name.charAt(0)}</span>
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-diary-card ${
                        member.isOnline ? "bg-green-500" : "bg-diary-muted"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-diary-text truncate">{member.name}</span>
                      {member.completedTasks === member.totalTasks ? (
                        <CheckCircle2 className="w-3 h-3 text-diary-accent flex-shrink-0" />
                      ) : (
                        <Circle className="w-3 h-3 text-diary-muted flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-diary-border rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${completionRate}%`,
                            backgroundColor: getCompletionColor(completionRate),
                          }}
                        />
                      </div>
                      <span className="text-xs text-diary-muted flex-shrink-0">
                        {member.completedTasks}/{member.totalTasks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 하단 요약 */}
        <div className="mt-4 pt-3 border-t border-diary-border">
          <div className="flex justify-between text-xs">
            <span className="text-diary-muted">완료율 평균</span>
            <span className="text-diary-text font-medium">
              {Math.round(
                mockMembers.reduce(
                  (sum, member) => sum + getCompletionRate(member.completedTasks, member.totalTasks),
                  0,
                ) / mockMembers.length,
              )}
              %
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-diary-muted">온라인 멤버</span>
            <span className="text-diary-text font-medium">
              {mockMembers.filter((member) => member.isOnline).length}명
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
