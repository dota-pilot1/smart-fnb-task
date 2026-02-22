import { Link } from 'react-router'
import { LoginForm } from '@/features/auth/ui/LoginForm'

export function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">로그인</h2>
      <LoginForm />
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
          회원가입
        </Link>
      </p>
    </div>
  )
}
