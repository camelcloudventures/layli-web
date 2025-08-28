import Link from "next/link";
import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between p-6">
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>

        <Link
          href="/auth/sign-up"
          className="text-sm font-medium text-[#0000FF] hover:text-[#5266EB] flex items-center gap-1"
        >
          Open Account
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Log In</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
