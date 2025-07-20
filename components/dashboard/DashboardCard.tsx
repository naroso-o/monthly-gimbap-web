import { CheckCircle2, Circle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "../ui/card";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  isCompleted: boolean;
  button: React.ReactNode;
  progress?: number;
  targetProgress?: number;
}

export const DashboardCard = ({
  title,
  icon,
  description,
  isCompleted,
  button,
  progress,
  targetProgress,
}: DashboardCardProps) => {
  return (
    <Card className="bg-white border border-stone-200 shadow-sm">
      <CardContent className="h-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium text-stone-700">{title}</span>
          </div>
          <div className="flex items-center justify-between">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            ) : (
              <Circle className="w-5 h-5 text-stone-400" />
            )}
          </div>
        </div>
        <p className="text-sm text-stone-500">{description}</p>
        {progress && (
          <div className="flex items-center justify-between text-sm text-stone-500">
            <span>진행률</span>
            <span className="font-semibold">{progress}/{targetProgress}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>{button}</CardFooter>
    </Card>
  );
};
