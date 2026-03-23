import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">受験秘書</h1>
        <p className="text-gray-600 mb-8 text-lg">総合型選抜（AO入試）をあなた専用にナビゲート</p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
            無料で始める
          </Link>
          <Link href="/login"
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition border border-indigo-200">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}