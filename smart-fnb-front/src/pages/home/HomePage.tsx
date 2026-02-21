import { useStore } from "@tanstack/react-store";
import { sessionStore } from "@/entities/session/model/session-store";

export function HomePage() {
  const token = useStore(sessionStore, (s) => s.token);
  const displayName = useStore(sessionStore, (s) => s.displayName);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart F&B</h1>
      <p className="text-lg text-gray-600 mb-8">
        Smart F&B에 오신 것을 환영합니다
      </p>
      {token ? (
        <p className="text-green-600 font-medium">
          {displayName}님, 환영합니다!
        </p>
      ) : (
        <p className="text-gray-500">로그인하여 시작하세요</p>
      )}
    </div>
  );
}
