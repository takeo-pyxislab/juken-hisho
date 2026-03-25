"use client"
import { useEffect, useState, useRef } from "react"
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
  faculty_name?: string
  department?: string
  priority: number
}

type UniSuggestion = { name: string; cats: string[] }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showAddUni, setShowAddUni] = useState(false)
  const [filter, setFilter] = useState<"all"|"week"|"month">("all")

  // 志望校追加用オートコンプリート
  const [uniSearch, setUniSearch] = useState("")
  const [suggestions, setSuggestions] = useState<UniSuggestion[]>([])
  const [sugLoading, setSugLoading] = useState(false)
  const [selectedUni, setSelectedUni] = useState("")
  const [deptGroups, setDeptGroups] = useState<Record<string, string[]>>({})
  const [deptLoading, setDeptLoading] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState("")
  const [selectedDept, setSelectedDept] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // 大学名サジェスト検索
  useEffect(() => {
    if (!uniSearch || uniSearch.length < 1 || uniSearch === selectedUni) {
      setSuggestions([])
      return
    }
    setSugLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/university-names?keyword=${encodeURIComponent(uniSearch)}`)
        const data = await res.json()
        setSuggestions(data.data || [])
      } catch { setSuggestions([]) }
      setSugLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [uniSearch, selectedUni])

  const selectUniversity = async (name: string) => {
    setSelectedUni(name)
    setUniSearch(name)
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedFaculty("")
    setSelectedDept("")
    setDeptGroups({})
    setDeptLoading(true)
    try {
      const res = await fetch(`/api/universities?keyword=${encodeURIComponent(name)}&limit=50`)
      const data = await res.json()
      const records: { faculty_name: string; department_name: string; university_name: string }[] =
        (data.data || []).filter((r: { university_name: string }) => r.university_name === name)
      const groups = records.reduce((acc, r) => {
        if (!acc[r.faculty_name]) acc[r.faculty_name] = []
        if (!acc[r.faculty_name].includes(r.department_name)) acc[r.faculty_name].push(r.department_name)
        return acc
      }, {} as Record<string, string[]>)
      setDeptGroups(groups)
    } catch {}
    setDeptLoading(false)
  }

  const addUniversity = async () => {
    if (!selectedUni) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("target_universities").insert({
      user_id: user!.id,
      university_name: selectedUni,
      faculty_name: selectedFaculty || null,
      department: selectedDept || null,
      priority: universities.length + 1,
    })
    setUniSearch("")
    setSelectedUni("")
    setSelectedFaculty("")
    setSelectedDept("")
    setDeptGroups({})
    setShowAddUni(false)
    loadData()
  }

  const removeUniversity = async (id: string) => {
    await supabase.from("target_universities").delete().eq("id", id)
    setUniversities(prev => prev.filter(u => u.id !== id))
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
    return false
  }

  const incomplete = tasks.filter(t => !t.is_completed)
  const filtered = tasks.filter(filterTask)
  const complete = tasks.filter(t => t.is_completed)
  const thisWeekCount = tasks.filter(t => !t.is_completed && t.due_date && new Date(t.due_date) <= endOfWeek).length

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-indigo-600">読み込み中...</p></div>

  const faculties = Object.keys(deptGroups)
  const depts = selectedFaculty ? (deptGroups[selectedFaculty] || []) : []

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
            <button onClick={() => { setShowAddUni(v => !v); setUniSearch(""); setSelectedUni(""); setDeptGroups({}) }}
              className="text-sm text-indigo-600 hover:underline">+ 追加</button>
          </div>

          {showAddUni && (
            <div className="mb-4 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* 大学名サジェスト */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">大学名</label>
                <input
                  ref={inputRef}
                  value={uniSearch}
                  onChange={e => { setUniSearch(e.target.value); setSelectedUni(""); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="大学名を入力（例：早稲田、北海道）"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                {sugLoading && (
                  <div className="absolute right-3 top-8 w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map(s => (
                      <button key={s.name} onMouseDown={() => selectUniversity(s.name)}
                        className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 text-sm border-b border-gray-50 last:border-0 flex items-center justify-between">
                        <span className="font-medium text-gray-800">{s.name}</span>
                        {s.cats.slice(0,1).map(c => <span key={c} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c}</span>)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 学部・学科選択（大学選択後） */}
              {selectedUni && (
                <>
                  {deptLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                      学部・学科を読み込み中...
                    </div>
                  ) : faculties.length > 0 ? (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">学部</label>
                        <select value={selectedFaculty} onChange={e => { setSelectedFaculty(e.target.value); setSelectedDept("") }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                          <option value="">学部を選択（任意）</option>
                          {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      {selectedFaculty && depts.length > 0 && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">学科</label>
                          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                            <option value="">学科を選択（任意）</option>
                            {depts.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">この大学の学科データが見つかりませんでした</p>
                  )}
                </>
              )}

              <button onClick={addUniversity} disabled={!selectedUni}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-indigo-700 transition">
                追加する
              </button>
            </div>
          )}

          {universities.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">志望校を追加してタスクを自動生成しましょう</p>
          ) : (
            <div className="space-y-2">
              {universities.map((u, i) => (
                <div key={u.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800">{u.university_name}</p>
                    {u.faculty_name && <p className="text-xs text-gray-600">{u.faculty_name}</p>}
                    {u.department && <p className="text-xs text-gray-400">{u.department}</p>}
                  </div>
                  <button onClick={() => removeUniversity(u.id)}
                    className="text-gray-300 hover:text-red-400 text-sm transition flex-shrink-0">✕</button>
                </div>
              ))}
            </div>
          )}

          {universities.length > 0 && (
            <button onClick={generateTasks} disabled={generating}
              className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 transition">
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
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
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
