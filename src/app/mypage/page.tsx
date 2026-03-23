"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-indigo-600">読み込み中...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">受験秘書</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg">
              ログアウト
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">ようこそ！</h2>
          <p className="text-gray-500 text-sm">あなた専用の受験サポートを始めましょう。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onClick={() => router.push("/questionnaire")}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-2 border-transparent hover:border-indigo-200">
            <div className="text-3xl mb-3">��</div>
            <h3 className="font-bold text-gray-800 mb-1">AI問診を受ける</h3>
            <p className="text-sm text-gray-500">あなたに合った大学・選抜方式を診断します</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">プレミアム</span>
          </div>
          <div onClick={() => router.push("/simulator")}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-2 border-transparent hover:border-green-200">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 mb-1">大学シミュレーター</h3>
            <p className="text-sm text-gray-500">7,980学科から日程・費用を比較</p>
            <span className="inline-block mt-3 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">無料</span>
          </div>
          <div onClick={() => router.push("/tasks")}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-2 border-transparent hover:border-orange-200">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-bold text-gray-800 mb-1">タスクリスト</h3>
            <p className="text-sm text-gray-500">出願までの逆算スケジュール</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">プレミアム</span>
          </div>
          <div onClick={() => router.push("/essay")}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-2 border-transparent hover:border-purple-200">
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-bold text-gray-800 mb-1">志望理由書を書く</h3>
            <p className="text-sm text-gray-500">AIが完成版を生成・リライト</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">プレミアム</span>
          </div>
        </div>
      </main>
    </div>
  )
}