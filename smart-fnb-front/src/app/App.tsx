import { Routes, Route } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { ProductListPage } from "@/pages/products/ProductListPage";
import { ProductDetailPage } from "@/pages/product-detail/ProductDetailPage";
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";
import { DevSpecPage } from "@/pages/devspec/DevSpecPage";
import { FigmaDetailPage } from "@/pages/figma-detail/FigmaDetailPage";

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="devspec" element={<DevSpecPage />} />
          <Route path="devspec/figma/:linkId" element={<FigmaDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
