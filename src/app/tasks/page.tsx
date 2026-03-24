"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Task = {
  id: string
  title: string
  description: string
  due_date: string
  category: string
  is_completed: boolean
  target_university_id: string | null
}

type University = {
  id: string
  university_name: string
  department: string
  priority: number
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newUni, setNewUni] = useState({ name: "", dept: "" })
  const [showAddUni, setShowAddUni] = useState(false)
  const [filter, setFilter] = useState<"all"|"week"|"month">("all")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    const [{ data: t }, { data: u }] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id).order("due_date"),
      supabase.from("target_universities").select("*").eq("user_id", user.id).order("priority"),
    ])
    setTasks(t || [])
    setUniversities(u || [])
    setLoading(false)
  }

  const addUniversity = async () => {
    if (!newUni.name) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("target_universities").insert({
      user_id: user!.id,
      university_name: newUni.name,
      department: newUni.dept,
      priority: universities.length + 1,
    })
    setNewUni({ name: "", dept: "" })
    setShowAddUni(false)
    loadData()
  }

  const generateTasks = async () => {
    setGenerating(true)
    const res = await fetch("/api/generate-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ universities }),
    })
    await res.json()
    await loadData()
    setGenerating(false)
  }

  const toggleTask = async (task: Task) => {
    await supabase.from("tasks").update({
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : null,
    }).eq("id", task.id)
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t))
  }

  const categoryColor: Record<string, string> = {
    "書類準備": "bg-blue-100 text-blue-700",
    "エントリー": "bg-purple-100 text-purple-700",
    "出願": "bg-orange-100 text-orange-700",
    "試験": "bg-red-100 text-red-700",
    "その他": "bg-gray-100 text-gray-600",
  }

  const now = new Date()
  const endOfWeek = new Date(now); endOfWeek.setDate(now.getDate() + 7)
  const endOfMonth = new Date(now); endOfMonth.setDate(now.getDate() + 30)

  const filterTask = (t: Task) => {
    if (t.is_completed) return false
    if (filter === "all") return true
    if (!t.due_date) return false
    const due = new Date(t.due_date)
    if (filter === "week") return due <= endOfWeek
    if (filter === "month") return due <= endOfMonth
    return true
  }

  const incomplete = tasks.filter(t => !t.is_completed)
  const filtered = tasks.filter(filterTask)
  const complete = tasks.filter(t => t.is_completed)
  const thisWeekCount = tasks.filter(t => !t.is_completed && t.due_date && new Date(t.due_date) <= endOfWeek).length

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-indigo-600">読み込み中...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/mypage")} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-lg font-bold text-indigo-700">タスクリスト</h1>
          </div>
          <span className="text-sm text-gray-400">{incomplete.length}件残り</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">志望校リスト</h2>
            <button onClick={() => setShowAddUni(v => !v)}
              className="text-sm text-indigo-600 hover:underline">+ 追加</button>
          </div>
          {showAddUni && (
            <div className="mb-4 space-y-2">
              <input value={newUni.name} onChange={e => setNewUni(v => ({ ...v, name: e.target.value }))}
                placeholder="大学名" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input value={newUni.dept} onChange={e => setNewUni(v => ({ ...v, dept: e.target.value }))}
                placeholder="学部・学科名" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <button onClick={addUniversity}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">追加する</button>
            </div>
          )}
          {universities.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">志望校を追加してタスクを自動生成しましょう</p>
          ) : (
            <div className="space-y-2">
              {universities.map((u, i) => (
                <div key={u.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{u.university_name}</p>
                    <p className="text-xs text-gray-500">{u.department}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {universities.length > 0 && (
            <button onClick={generateTasks} disabled={generating}
              className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
              {generating ? "タスクを生成中..." : "✨ タスクを自動生成"}
            </button>
          )}
        </div>

        {/* フィルタータブ */}
        {tasks.length > 0 && (
          <div className="flex gap-2">
            {([
              { id: "all", label: "すべて", count: incomplete.length },
              { id: "week", label: "今週", count: thisWeekCount },
              { id: "month", label: "今月", count: tasks.filter(t => !t.is_completed && t.due_date && new Date(t.due_date) <= endOfMonth).length },
            ] as const).map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${filter === f.id ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-300"}`}>
                {f.label}
                <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 ${filter === f.id ? "bg-white text-indigo-600" : "bg-gray-100 text-gray-500"}`}>{f.count}</span>
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold text-gray-700 text-sm px-1">
              {filter === "week" ? "今週やること" : filter === "month" ? "今月やること" : "未完了"} ({filtered.length})
            </h2>
            {filtered.map(task => (
              <div key={task.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                <button onClick={() => toggleTask(task)}
                  className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 hover:border-indigo-400 transition" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                  {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    {task.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[task.category] || "bg-gray-100 text-gray-600"}`}>
                        {task.category}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="text-xs text-gray-400">期限: {new Date(task.due_date).toLocaleDateString("ja-JP")}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {complete.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold text-gray-400 text-sm px-1">完了済み ({complete.length})</h2>
            {complete.map(task => (
              <div key={task.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3 opacity-60">
                <button onClick={() => toggleTask(task)}
                  className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </button>
                <p className="font-medium text-gray-500 text-sm line-through">{task.title}</p>
              </div>
            ))}
          </div>
        )}

        {tasks.length === 0 && universities.length > 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-gray-500">「タスクを自動生成」ボタンを押してください</p>
          </div>
        )}
      </main>
    </div>
  )
}