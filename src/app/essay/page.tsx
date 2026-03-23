"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Statement = {
  id: string
  university_name: string
  department: string
  word_limit: number
  content: string
  version: number
}

export default function EssayPage() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [selected, setSelected] = useState<Statement | null>(null)
  const [generating, setGenerating] = useState(false)
  const [rewriting, setRewriting] = useState(false)
  const [rewriteNote, setRewriteNote] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ university: "", dept: "", limit: 800, theme: "" })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { loadStatements() }, [])

  const loadStatements = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    const { data } = await supabase.from("personal_statements").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    setStatements(data || [])
    if (data && data.length > 0 && !selected) setSelected(data[0])
  }

  const generate = async () => {
    setGenerating(true)
    const { data: { user } } = await supabase.auth.getUser()
    const res = await fetch("/api/generate-essay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newForm, user_id: user!.id }),
    })
    const data = await res.json()
    if (data.id) {
      await loadStatements()
      setSelected(data)
      setShowNew(false)
    }
    setGenerating(false)
  }

  const rewrite = async () => {
    if (!selected || !rewriteNote) return
    setRewriting(true)
    const res = await fetch("/api/rewrite-essay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statement_id: selected.id, note: rewriteNote }),
    })
    const data = await res.json()
    if (data.content) {
      setSelected(prev => prev ? { ...prev, content: data.content, version: prev.version + 1 } : prev)
      await supabase.from("personal_statements").update({ content: data.content, version: selected.version + 1 }).eq("id", selected.id)
      setRewriteNote("")
    }
    setRewriting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/mypage")} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-lg font-bold text-indigo-700">志望理由書</h1>
          </div>
          <button onClick={() => setShowNew(v => !v)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            + 新規作成
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {showNew && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 space-y-4">
            <h2 className="font-bold text-gray-800">新しい志望理由書を生成</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大学名</label>
                <input value={newForm.university} onChange={e => setNewForm(v => ({ ...v, university: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="例：早稲田大学" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学部・学科</label>
                <input value={newForm.dept} onChange={e => setNewForm(v => ({ ...v, dept: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="例：政治経済学部" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">字数制限</label>
              <select value={newForm.limit} onChange={e => setNewForm(v => ({ ...v, limit: Number(e.target.value) }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {[400, 600, 800, 1000, 1200, 1600, 2000].map(n => (
                  <option key={n} value={n}>{n}字以内</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">大学独自のテーマ（任意）</label>
              <input value={newForm.theme} onChange={e => setNewForm(v => ({ ...v, theme: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="例：SDGsへの取り組み、グローバルリーダーとして..." />
            </div>
            <button onClick={generate} disabled={generating || !newForm.university || !newForm.dept}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
              {generating ? "AIが生成中（30秒ほどかかります）..." : "✨ 志望理由書を生成する"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="font-bold text-gray-700 text-sm mb-3">作成済み一覧</h2>
            {statements.length === 0 ? (
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">まだありません</p>
                <p className="text-xs text-gray-400 mt-1">「+ 新規作成」から生成しましょう</p>
              </div>
            ) : (
              <div className="space-y-2">
                {statements.map(s => (
                  <button key={s.id} onClick={() => setSelected(s)}
                    className={`w-full text-left p-3 rounded-xl border transition ${selected?.id === s.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <p className="font-medium text-sm text-gray-800">{s.university_name}</p>
                    <p className="text-xs text-gray-500">{s.department} / {s.word_limit}字</p>
                    <p className="text-xs text-indigo-500 mt-1">v{s.version}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-gray-800">{selected.university_name} {selected.department}</h2>
                    <p className="text-sm text-gray-500">{selected.word_limit}字以内 / v{selected.version} / 現在{selected.content?.length || 0}字</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(selected.content)}
                    className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1 rounded-lg hover:bg-indigo-50">
                    コピー
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap min-h-48">
                  {selected.content || "内容なし"}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">✏️ リライト指示</h3>
                <textarea value={rewriteNote} onChange={e => setRewriteNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows={3} placeholder="例：もっと具体的なエピソードを入れてください / 冒頭を印象的にしてください / ゼミ活動への言及を追加してください" />
                <button onClick={rewrite} disabled={rewriting || !rewriteNote}
                  className="mt-3 w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
                  {rewriting ? "リライト中..." : "🔄 リライトする"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}