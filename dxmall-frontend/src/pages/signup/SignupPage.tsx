import { Link } from 'react-router'
import { SignupForm } from '@/features/auth/ui/SignupForm'

export function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">회원가입</h2>
      <SignupForm />
      <p className="mt-6 text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
