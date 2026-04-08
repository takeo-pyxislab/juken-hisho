"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

type Profile = {
  nickname?: string
  grade?: string
  prefecture?: string
  directions?: string[]
  target_universities_text?: string[]
}

type AnalysisResult = {
  id: string
  profile_summary?: string
  strength_tags?: string[]
  selection_fit?: Record<string, number>
  suggested_universities?: Array<{name: string; department: string; match_score: number; is_anaba: boolean}>
  next_actions?: string[]
  created_at: string
}

type Task = {
  id: string
  title: string
  due_date: string
  category: string
  is_completed: boolean
  target_university_id?: string
}

type TargetUniversity = {
  id: string
  university_name: string
  faculty_name?: string
  department?: string
  priority?: number
}

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [targets, setTargets] = useState<TargetUniversity[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteCopied, setInviteCopied] = useState(false)
  const [inviteError, setInviteError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      if (user.user_metadata?.user_type === "parent") { router.push("/parent"); return }
      setUser(user)

      const [{ data: profiles }, { data: results }, { data: taskData }, { data: targetData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("analysis_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("tasks").select("*").eq("user_id", user.id).eq("is_completed", false).order("due_date").limit(5),
        supabase.from("target_universities").select("*").eq("user_id", user.id).order("priority").limit(5),
      ])

      setProfile(profiles?.[0] || null)
      setAnalysis(results?.[0] || null)
      setTasks(taskData || [])
      setTargets(targetData || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const toggleTask = async (task: Task) => {
    await supabase.from("tasks").update({ is_completed: true, completed_at: new Date().toISOString() }).eq("id", task.id)
    setTasks(prev => prev.filter(t => t.id !== task.id))
  }

  const generateInviteUrl = async () => {
    setInviteLoading(true)
    setInviteError("")
    try {
      const res = await fetch("/api/family/invite", { method: "POST" })
      const data = await res.json()
      if (data.token) {
        const url = `${window.location.origin}/invite/${data.token}`
        setInviteUrl(url)
      } else {
        setInviteError(data.error || "URLの発行に失敗しました")
      }
    } catch {
      setInviteError("通信エラーが発生しました")
    }
    setInviteLoading(false)
  }

  const copyInviteUrl = async () => {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setInviteCopied(true)
    setTimeout(() => setInviteCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    </div>
  )

  const displayName = profile?.nickname || user?.email?.split("@")[0] || "ユーザー"

  const topScores = analysis?.selection_fit
    ? Object.entries(analysis.selection_fit).sort((a,b) => b[1]-a[1]).slice(0,2)
    : []
  const selectionLabel: Record<string, string> = {
    interview:"面接",essay:"小論文",portfolio:"活動実績",presentation:"プレゼン"
  }

  const categoryColor: Record<string, string> = {
    "書類準備":"bg-blue-100 text-blue-700",
    "エントリー":"bg-purple-100 text-purple-700",
    "出願":"bg-orange-100 text-orange-700",
    "試験":"bg-red-100 text-red-700",
    "その他":"bg-gray-100 text-gray-600",
  }

  const today = new Date()
  const daysUntil = (dateStr: string) => {
    const d = new Date(dateStr)
    return Math.ceil((d.getTime() - today.getTime()) / (1000*60*60*24))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header style={{background:"linear-gradient(135deg,#1c1917,#134e4a)", position:"sticky", top:0, zIndex:10}}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ユニパス" className="nav-logo-dark" style={{objectFit:"contain", filter:"brightness(0) invert(1)"}} />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p style={{fontSize:"13px",fontWeight:700,color:"#fff"}}>{displayName}</p>
              {profile?.grade && <p style={{fontSize:"10px",color:"rgba(255,255,255,.5)"}}>{profile.grade}{profile.prefecture ? ` · ${profile.prefecture}` : ""}</p>}
            </div>
            <button onClick={handleLogout} style={{padding:"5px 12px",borderRadius:"8px",border:"1px solid rgba(255,255,255,.2)",background:"transparent",color:"rgba(255,255,255,.7)",fontSize:"11px",cursor:"pointer"}}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 診断未完了バナー */}
        {!analysis && (
          <div style={{background:"linear-gradient(135deg,#0d9488,#06b6d4)",borderRadius:"16px",padding:"24px",marginBottom:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
            <div>
              <p style={{fontSize:"16px",fontWeight:800,color:"#fff",marginBottom:"4px"}}>✦ AI診断を始めましょう</p>
              <p style={{fontSize:"13px",color:"rgba(255,255,255,.8)"}}>6〜7ステップの問診に答えると、あなた専用の受験プランが作成されます</p>
            </div>
            <Link href="/questionnaire" style={{padding:"12px 28px",borderRadius:"10px",background:"#fff",color:"var(--teal2)",fontSize:"14px",fontWeight:700,textDecoration:"none",whiteSpace:"nowrap"}}>
              今すぐ診断する →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 左カラム */}
          <div className="space-y-5">
            {/* 志望校リスト */}
            <div style={{background:"#fff",borderRadius:"16px",border:"1.5px solid var(--border)",padding:"20px",boxShadow:"var(--sh-sm)"}}>
              <div className="flex justify-between items-center mb-4">
                <h2 style={{fontSize:"14px",fontWeight:700,color:"var(--ink)"}}>🎯 志望校リスト</h2>
                <Link href="/tasks" style={{fontSize:"11px",color:"var(--teal)",fontWeight:600,textDecoration:"none"}}>+ 管理</Link>
              </div>
              {targets.length === 0 && (profile?.target_universities_text || []).length === 0 ? (
                <div className="text-center py-4">
                  <p style={{fontSize:"12px",color:"var(--ink3)"}}>まだ登録されていません</p>
                  <Link href="/questionnaire" style={{fontSize:"11px",color:"var(--teal)",textDecoration:"none",fontWeight:600}}>問診票で登録する →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {targets.map((u, i) => (
                    <div key={u.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:"var(--surface2)",borderRadius:"10px"}}>
                      <div style={{width:"22px",height:"22px",background:"linear-gradient(135deg,var(--teal),#06b6d4)",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:"#fff",flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:"12px",fontWeight:600,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.university_name}</p>
                        {u.faculty_name && <p style={{fontSize:"10px",color:"var(--ink2)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.faculty_name}</p>}
                        {u.department && <p style={{fontSize:"10px",color:"var(--ink3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.department}</p>}
                      </div>
                    </div>
                  ))}
                  {/* 問診票で登録した志望校も表示 */}
                  {targets.length === 0 && (profile?.target_universities_text || []).slice(0,5).map((name, i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:"var(--surface2)",borderRadius:"10px"}}>
                      <div style={{width:"22px",height:"22px",background:"linear-gradient(135deg,var(--teal),#06b6d4)",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:"#fff",flexShrink:0}}>{i+1}</div>
                      <p style={{fontSize:"12px",fontWeight:600,color:"var(--ink)"}}>{name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 保護者招待 */}
            <div style={{background:"#fff",borderRadius:"16px",border:"1.5px solid var(--border)",padding:"20px",boxShadow:"var(--sh-sm)"}}>
              <h2 style={{fontSize:"14px",fontWeight:700,color:"var(--ink)",marginBottom:"12px"}}>👨‍👩‍👧 保護者を招待</h2>
              {!inviteUrl ? (
                <div>
                  <p style={{fontSize:"11px",color:"var(--ink3)",lineHeight:1.6,marginBottom:"12px"}}>招待URLを発行して保護者と連携。保護者はあなたの志望校・タスク・日程を閲覧できます。</p>
                  <button onClick={generateInviteUrl} disabled={inviteLoading}
                    style={{width:"100%",padding:"10px",borderRadius:"9px",border:"none",background:"var(--teal)",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:inviteLoading?0.7:1}}>
                    {inviteLoading ? "生成中..." : "🔗 招待URLを発行する"}
                  </button>
                  {inviteError && (
                    <p style={{fontSize:"11px",color:"var(--rose)",marginTop:"8px"}}>{inviteError}</p>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{background:"var(--surface2)",borderRadius:"8px",padding:"10px 12px",fontSize:"11px",color:"var(--ink2)",wordBreak:"break-all",marginBottom:"8px",fontFamily:"DM Mono,monospace"}}>
                    {inviteUrl}
                  </div>
                  <button onClick={copyInviteUrl}
                    style={{width:"100%",padding:"9px",borderRadius:"9px",border:"1.5px solid var(--teal)",background:inviteCopied?"var(--teal)":"transparent",color:inviteCopied?"#fff":"var(--teal)",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:".15s"}}>
                    {inviteCopied ? "✓ コピーしました" : "📋 URLをコピー"}
                  </button>
                  <p style={{fontSize:"10px",color:"var(--ink3)",marginTop:"8px",lineHeight:1.6}}>このURLをLINEやメールで保護者に送ってください</p>
                </div>
              )}
            </div>

            {/* タスクリスト */}
            <div style={{background:"#fff",borderRadius:"16px",border:"1.5px solid var(--border)",padding:"20px",boxShadow:"var(--sh-sm)"}}>
              <div className="flex justify-between items-center mb-4">
                <h2 style={{fontSize:"14px",fontWeight:700,color:"var(--ink)"}}>✅ 直近のタスク</h2>
                <Link href="/tasks" style={{fontSize:"11px",color:"var(--teal)",fontWeight:600,textDecoration:"none"}}>すべて見る</Link>
              </div>
              {tasks.length === 0 ? (
                <div className="text-center py-4">
                  <p style={{fontSize:"12px",color:"var(--ink3)"}}>タスクがありません</p>
                  <Link href="/tasks" style={{fontSize:"11px",color:"var(--teal)",textDecoration:"none",fontWeight:600}}>志望校を登録して自動生成 →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map(task => {
                    const days = task.due_date ? daysUntil(task.due_date) : null
                    return (
                      <div key={task.id} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"10px",background:"var(--surface2)",borderRadius:"10px"}}>
                        <button onClick={() => toggleTask(task)}
                          style={{width:"18px",height:"18px",minWidth:"18px",borderRadius:"50%",border:"2px solid var(--border)",background:"transparent",cursor:"pointer",marginTop:"1px"}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:"12px",fontWeight:600,color:"var(--ink)",lineHeight:1.4}}>{task.title}</p>
                          <div style={{display:"flex",gap:"6px",marginTop:"4px",flexWrap:"wrap"}}>
                            {task.category && <span style={{fontSize:"10px",padding:"1px 7px",borderRadius:"20px",fontWeight:600}} className={categoryColor[task.category]}>{task.category}</span>}
                            {days !== null && <span style={{fontSize:"10px",color:days <= 7 ? "#e11d48" : days <= 14 ? "var(--amber)" : "var(--ink3)",fontWeight:600}}>{days <= 0 ? "期限超過" : `あと${days}日`}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 中央・右カラム */}
          <div className="lg:col-span-2 space-y-5">
            {/* AI診断サマリー */}
            {analysis ? (
              <div style={{background:"linear-gradient(135deg,#134e4a,#0f766e,#0d9488)",borderRadius:"16px",padding:"24px",color:"#fff",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 8px)"}}/>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:"11px",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:"8px"}}>✨ あなたの診断結果</div>
                  <p style={{fontSize:"15px",lineHeight:1.8,color:"rgba(255,255,255,.9)",marginBottom:"16px"}}>{analysis.profile_summary}</p>
                  {/* 強みタグ */}
                  <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"16px"}}>
                    {(analysis.strength_tags || []).map(tag => (
                      <span key={tag} style={{background:"rgba(255,255,255,.15)",padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:600}}>#{tag}</span>
                    ))}
                  </div>
                  {/* 相性スコア */}
                  {topScores.length > 0 && (
                    <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"16px"}}>
                      {topScores.map(([key, score]) => (
                        <div key={key} style={{background:"rgba(255,255,255,.1)",borderRadius:"10px",padding:"10px 16px",textAlign:"center"}}>
                          <div style={{fontSize:"20px",fontWeight:900,fontFamily:"DM Mono,monospace",color:"#5eead4"}}>{score}%</div>
                          <div style={{fontSize:"10px",color:"rgba(255,255,255,.6)",marginTop:"2px"}}>{selectionLabel[key] || key}との相性</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href={`/result/${analysis.id}`} style={{display:"inline-block",padding:"10px 20px",background:"rgba(255,255,255,.15)",borderRadius:"10px",border:"1px solid rgba(255,255,255,.25)",color:"#fff",fontSize:"12px",fontWeight:700,textDecoration:"none"}}>
                    詳しい診断結果を見る →
                  </Link>
                </div>
              </div>
            ) : null}

            {/* おすすめ大学 */}
            {analysis?.suggested_universities && analysis.suggested_universities.length > 0 && (
              <div style={{background:"#fff",borderRadius:"16px",border:"1.5px solid var(--border)",padding:"20px",boxShadow:"var(--sh-sm)"}}>
                <div className="flex justify-between items-center mb-4">
                  <h2 style={{fontSize:"14px",fontWeight:700,color:"var(--ink)"}}>🎓 AIがおすすめする大学</h2>
                  <Link href={`/result/${analysis.id}`} style={{fontSize:"11px",color:"var(--teal)",fontWeight:600,textDecoration:"none"}}>詳細 →</Link>
                </div>
                <div className="space-y-3">
                  {analysis.suggested_universities.slice(0,3).map((u, i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px",background:"var(--surface2)",borderRadius:"12px"}}>
                      <div style={{width:"28px",height:"28px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:900,color:"#fff",background:i===0?"linear-gradient(135deg,#d97706,#f59e0b)":i===1?"linear-gradient(135deg,#6b7280,#9ca3af)":"linear-gradient(135deg,#92400e,#b45309)",flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:"13px",fontWeight:700,color:"var(--ink)"}}>{u.name}</p>
                        <p style={{fontSize:"11px",color:"var(--teal)"}}>{u.department}</p>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"3px"}}>
                        <span style={{fontSize:"18px",fontWeight:900,fontFamily:"DM Mono,monospace",color:"var(--teal)"}}>{u.match_score}%</span>
                        {u.is_anaba && <span style={{fontSize:"9px",background:"linear-gradient(135deg,#d97706,#f59e0b)",color:"#fff",padding:"1px 7px",borderRadius:"20px",fontWeight:700}}>穴場</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 機能カード */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {href:"/questionnaire", icon:"🧠", title:"AI問診を受ける", desc:"プロフィールを更新して再診断", badge:"診断", color:"indigo"},
                {href:"/simulator", icon:"🔍", title:"大学シミュレーター", desc:"8,015学科を検索・比較", badge:"無料", color:"teal"},
                {href:"/tasks", icon:"✅", title:"タスクリスト", desc:"出願までの逆算スケジュール", badge:"管理", color:"orange"},
                {href:"/essay", icon:"✍️", title:"志望理由書", desc:"AI生成・リライト", badge:"作成", color:"purple"},
              ].map((card) => (
                <Link key={card.href} href={card.href}
                  style={{background:"#fff",borderRadius:"14px",border:"1.5px solid var(--border)",padding:"18px",textDecoration:"none",display:"block",boxShadow:"var(--sh-sm)",transition:".2s"}}>
                  <div style={{fontSize:"28px",marginBottom:"10px"}}>{card.icon}</div>
                  <div style={{fontSize:"13px",fontWeight:700,color:"var(--ink)",marginBottom:"4px"}}>{card.title}</div>
                  <div style={{fontSize:"11px",color:"var(--ink3)",lineHeight:1.5}}>{card.desc}</div>
                </Link>
              ))}
            </div>

            {/* 今すぐできること */}
            {analysis?.next_actions && analysis.next_actions.length > 0 && (
              <div style={{background:"var(--teal-bg)",borderRadius:"16px",border:"1px solid var(--teal-border)",padding:"20px"}}>
                <h2 style={{fontSize:"14px",fontWeight:700,color:"var(--teal2)",marginBottom:"12px"}}>📌 AIからの今すぐできること</h2>
                <div className="space-y-2">
                  {analysis.next_actions.map((action, i) => (
                    <div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                      <div style={{width:"20px",height:"20px",background:"var(--teal)",color:"#fff",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                      <p style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.6}}>{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}