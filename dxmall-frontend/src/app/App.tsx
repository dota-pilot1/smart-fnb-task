import { Routes, Route } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { ProductListPage } from "@/pages/products/ProductListPage";
import { ProductDetailPage } from "@/pages/product-detail/ProductDetailPage";
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* 보호 라우트 - 추후 확장 */}
        <Route element={<ProtectedRoute />}>
          {/* 예: <Route path="orders" element={<OrdersPage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}
