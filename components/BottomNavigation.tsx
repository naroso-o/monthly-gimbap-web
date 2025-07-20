import { Calendar, MessageCircle, Users } from "lucide-react";

export const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-stone-700"></div>
            <span className="text-xs text-stone-600">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Calendar className="w-5 h-5 text-stone-400" />
            <span className="text-xs text-stone-400">출석</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <MessageCircle className="w-5 h-5 text-stone-400" />
            <span className="text-xs text-stone-400">댓글</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-stone-400" />
            <span className="text-xs text-stone-400">멤버</span>
          </button>
        </div>
      </div>
    </div>
  );
};
