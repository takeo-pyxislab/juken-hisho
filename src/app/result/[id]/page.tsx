"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useParams } from "next/navigation"

type Result = {
  profile_summary: string
  strength_tags: string[]
  selection_fit: Record<string, number>
  recommended_faculties: string[]
  suggested_universities: Array<{ name: string; faculty: string; reason: string; is_anaba: boolean }>
  advice: string
  next_actions: string[]
}

export default function ResultPage() {
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    supabase.from("analysis_results").select("*").eq("id", params.id).single()
      .then(({ data }) => { setResult(data); setLoading(false) })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🔮</div>
        <p className="text-indigo-600 font-medium">AIが診断結果を準備中...</p>
      </div>
    </div>
  )

  if (!result) return <div className="min-h-screen flex items-center justify-center">結果が見つかりません</div>

  const selectionLabels: Record<string, string> = {
    interview: "面接・口頭試問",
    essay: "小論文・志望理由書",
    portfolio: "ポートフォリオ",
    presentation: "プレゼンテーション"
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-indigo-700">受験秘書</h1>
          <button onClick={() => router.push("/mypage")} className="text-sm text-gray-500 hover:text-gray-700">マイページへ</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-indigo-200 text-sm mb-2">✨ あなたの診断結果</p>
          <p className="text-lg font-medium leading-relaxed">{result.profile_summary}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {result.strength_tags?.map(tag => (
              <span key={tag} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">📊 選抜方式との相性</h3>
          <div className="space-y-3">
            {Object.entries(result.selection_fit || {}).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{selectionLabels[key] || key}</span>
                  <span className="font-bold text-indigo-600">{score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">🎓 おすすめ大学・学部</h3>
          <div className="space-y-4">
            {result.suggested_universities?.map((u, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-bold text-gray-800">{u.name}</p>
                    <p className="text-sm text-indigo-600">{u.faculty}</p>
                  </div>
                  {u.is_anaba && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">穴場</span>}
                </div>
                <p className="text-sm text-gray-500 mt-2">{u.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">💡 AIからのアドバイス</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{result.advice}</p>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6">
          <h3 className="font-bold text-indigo-800 mb-3">✅ 今すぐできること</h3>
          <ul className="space-y-2">
            {result.next_actions?.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-indigo-700">
                <span className="font-bold mt-0.5">{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 次のアクション */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-1">🚀 診断結果をもとに、次のステップへ</h3>
          <p className="text-xs text-gray-400 mb-4">どれか一つから始めるだけでOKです</p>
          <div className="space-y-3">
            <button onClick={() => router.push("/tasks")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50 hover:border-indigo-400 transition text-left">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold text-indigo-700 text-sm">タスクを自動生成する</p>
                <p className="text-xs text-indigo-400 mt-0.5">出願までの逆算スケジュールをAIが作成</p>
              </div>
              <span className="ml-auto text-indigo-400">→</span>
            </button>
            <button onClick={() => router.push("/simulator")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-teal-100 bg-teal-50 hover:border-teal-400 transition text-left">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-bold text-teal-700 text-sm">シミュレーターで大学を探す</p>
                <p className="text-xs text-teal-400 mt-0.5">おすすめ大学の日程・費用・専願可否を確認</p>
              </div>
              <span className="ml-auto text-teal-400">→</span>
            </button>
            <button onClick={() => router.push("/essay")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-purple-100 bg-purple-50 hover:border-purple-400 transition text-left">
              <span className="text-2xl">✍️</span>
              <div>
                <p className="font-bold text-purple-700 text-sm">志望理由書を書き始める</p>
                <p className="text-xs text-purple-400 mt-0.5">AIがあなたの強みを活かした文章を生成</p>
              </div>
              <span className="ml-auto text-purple-400">→</span>
            </button>
          </div>
        </div>

        <button onClick={() => router.push("/mypage")}
          className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
          マイページに戻る
        </button>
      </main>
    </div>
  )
}