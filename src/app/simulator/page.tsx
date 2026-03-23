"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type University = {
  id: string
  university_name: string
  faculty_name: string
  department_name: string
  exam_type: string
  application_type: string
  has_kyotsuu: string
  prefecture: string
  faculty_category: string
  exam_date: string
  application_start: string
  cost: string
}

const PREFECTURES = ["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"]
const CATEGORIES = ["医療・保健","教育","理工・情報","芸術・スポーツ","農・食・環境","法・経済・経営","文系・国際","その他"]

export default function SimulatorPage() {
  const [results, setResults] = useState<University[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [prefecture, setPrefecture] = useState("")
  const [category, setCategory] = useState("")
  const [kyotsuu, setKyotsuu] = useState("")
  const [appType, setAppType] = useState("")
  const router = useRouter()

  const search = useCallback(async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set("keyword", keyword)
    if (prefecture) params.set("prefecture", prefecture)
    if (category) params.set("category", category)
    if (kyotsuu) params.set("kyotsuu", kyotsuu)
    if (appType) params.set("app_type", appType)
    params.set("page", String(p))

    const res = await fetch(`/api/universities?${params}`)
    const data = await res.json()
    setResults(data.data || [])
    setTotal(data.count || 0)
    setPage(p)
    setLoading(false)
  }, [keyword, prefecture, category, kyotsuu, appType])

  useEffect(() => { search(1) }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/mypage")} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-lg font-bold text-indigo-700">大学シミュレーター</h1>
          </div>
          <span className="text-sm text-gray-400">{total.toLocaleString()}件</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search(1)}
              placeholder="大学名・学部名で検索..."
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 col-span-full"
            />
            <select value={prefecture} onChange={e => setPrefecture(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">都道府県（すべて）</option>
              {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">学部系統（すべて）</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={kyotsuu} onChange={e => setKyotsuu(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">共通テスト（すべて）</option>
              <option value="あり">あり</option>
              <option value="なし">なし</option>
            </select>
            <select value={appType} onChange={e => setAppType(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">出願区分（すべて）</option>
              <option value="専願">専願</option>
              <option value="併願">併願</option>
            </select>
          </div>
          <button onClick={() => search(1)} disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition text-sm">
            {loading ? "検索中..." : "🔍 検索する"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-indigo-600">検索中...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p>条件に一致する大学が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {results.map(u => (
                <div key={u.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800">{u.university_name}</p>
                      <p className="text-sm text-indigo-600">{u.faculty_name} {u.department_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{u.exam_type}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{u.prefecture}</span>
                      {u.has_kyotsuu === "あり" && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">共通テスト</span>
                      )}
                      {u.application_type === "専願" && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">専願</span>
                      )}
                    </div>
                  </div>
                  {u.exam_date && u.exam_date !== "no data" && (
                    <p className="text-xs text-gray-400 mt-2">試験日: {u.exam_date.slice(0, 50)}{u.exam_date.length > 50 ? "..." : ""}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              {page > 1 && (
                <button onClick={() => search(page - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  ← 前へ
                </button>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                {page} / {Math.ceil(total / 20)}ページ
              </span>
              {page < Math.ceil(total / 20) && (
                <button onClick={() => search(page + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  次へ →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}