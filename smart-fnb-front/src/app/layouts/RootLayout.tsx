import { Outlet } from "react-router";
import { AppHeader } from "@/widgets/header";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );

}
