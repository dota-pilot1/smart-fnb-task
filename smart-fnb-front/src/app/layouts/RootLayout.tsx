import { Outlet } from "react-router";
import { AppHeader } from "@/widgets/header";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
