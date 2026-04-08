"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

type TargetUniversity = {
  id: string
  university_name: string
  faculty_name?: string
  department?: string
  priority?: number
}

type Task = {
  id: string
  title: string
  due_date: string
  category: string
  is_completed: boolean
}

type StudentData = {
  student_id: string
  email: string
  targets: TargetUniversity[]
  tasks: Task[]
}

const categoryColor: Record<string, { bg: string; text: string }> = {
  "書類準備": { bg: "#dbeafe", text: "#1d4ed8" },
  "エントリー": { bg: "#ede9fe", text: "#7c3aed" },
  "出願": { bg: "#ffedd5", text: "#c2410c" },
  "試験": { bg: "#fee2e2", text: "#dc2626" },
  "その他": { bg: "#f3f4f6", text: "#6b7280" },
}

export default function ParentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [linked, setLinked] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      // 受験生アカウントはマイページへ
      if (user.user_metadata?.user_type === "student") { router.push("/mypage"); return }
      setUser(user)

      // 連携している学生を取得
      const { data: links } = await supabase
        .from("family_links")
        .select("student_user_id")
        .eq("parent_user_id", user.id)
        .eq("status", "active")

      if (!links || links.length === 0) {
        setLoading(false)
        return
      }

      setLinked(true)

      // 各学生のデータを取得
      const studentDataList: StudentData[] = []
      for (const link of links) {
        const sid = link.student_user_id

        const [{ data: targets }, { data: tasks }, { data: studentProfile }] = await Promise.all([
          supabase.from("target_universities").select("*").eq("user_id", sid).order("priority").limit(10),
          supabase.from("tasks").select("*").eq("user_id", sid).eq("is_completed", false).order("due_date").limit(10),
          supabase.from("profiles").select("nickname, grade, prefecture").eq("user_id", sid).limit(1),
        ])

        const profile = studentProfile?.[0]
        const label = profile?.nickname
          ? `${profile.nickname}${profile.grade ? `（${profile.grade}）` : ""}`
          : `受験生`

        studentDataList.push({
          student_id: sid,
          email: label,
          targets: targets || [],
          tasks: tasks || [],
        })
      }

      setStudents(studentDataList)
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const today = new Date()
  const daysUntil = (dateStr: string) => {
    const d = new Date(dateStr)
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) return (
    <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:"36px", height:"36px", border:"4px solid var(--border)", borderTop:"4px solid var(--teal)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 12px"}}/>
        <p style={{fontSize:"13px", color:"var(--ink3)"}}>読み込み中...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)"}}>
      {/* ヘッダー */}
      <header style={{background:"linear-gradient(135deg,#1c1917,#134e4a)", position:"sticky", top:0, zIndex:10}}>
        <div style={{maxWidth:"960px", margin:"0 auto", padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
            <img src="/logo.png" alt="ユニパス" className="nav-logo-dark" style={{objectFit:"contain", filter:"brightness(0) invert(1)"}} />
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
            <span style={{fontSize:"12px", color:"rgba(255,255,255,.6)"}}>👨‍👩‍👧 {user?.email}</span>
            <button onClick={handleLogout}
              style={{padding:"5px 12px", borderRadius:"8px", border:"1px solid rgba(255,255,255,.2)", background:"transparent", color:"rgba(255,255,255,.7)", fontSize:"11px", cursor:"pointer", fontFamily:"inherit"}}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main style={{maxWidth:"960px", margin:"0 auto", padding:"24px 20px"}}>
        {/* 未連携状態 */}
        {!linked && (
          <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"16px", padding:"48px 32px", textAlign:"center", boxShadow:"var(--sh-sm)"}}>
            <div style={{fontSize:"56px", marginBottom:"16px"}}>🔗</div>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"12px"}}>お子さんのアカウントと連携しましょう</h2>
            <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.9, marginBottom:"28px", maxWidth:"420px", margin:"0 auto 28px"}}>
              まだお子さんのアカウントと連携されていません。<br/>
              お子さんのマイページの「保護者を招待」ボタンから<br/>招待URLを受け取ってください。
            </p>
            <div style={{background:"var(--surface2)", borderRadius:"12px", padding:"20px", textAlign:"left", maxWidth:"380px", margin:"0 auto", marginBottom:"24px"}}>
              <div style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"10px"}}>連携手順</div>
              {[
                "お子さんがマイページを開く",
                "「保護者を招待」ボタンを押して招待URLを発行",
                "URLをLINE/メールで受け取る",
                "URLを開くと自動で連携完了",
              ].map((step, i) => (
                <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"8px"}}>
                  <div style={{width:"20px", height:"20px", background:"var(--teal)", color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, flexShrink:0}}>{i+1}</div>
                  <p style={{fontSize:"12px", color:"var(--ink2)", lineHeight:1.6}}>{step}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:"11px", color:"var(--ink3)"}}>
              お子さんがまだユニパスを使っていない場合は、<br/>
              <Link href="/simulator" style={{color:"var(--teal)", fontWeight:600}}>シミュレーター</Link>を一緒に試してみてください
            </p>
          </div>
        )}

        {/* 連携済み：各学生のダッシュボード */}
        {linked && students.map((student, si) => (
          <div key={student.student_id} style={{marginBottom:"32px"}}>
            {students.length > 1 && (
              <div style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px"}}>
                <span style={{width:"22px", height:"22px", background:"var(--teal)", color:"#fff", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700}}>{si+1}</span>
                {student.email}
              </div>
            )}

            {students.length === 1 && (
              <div style={{background:"linear-gradient(135deg,#134e4a,#0f766e)", borderRadius:"14px", padding:"20px 24px", marginBottom:"20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px"}}>
                <div>
                  <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".08em", color:"rgba(255,255,255,.5)", marginBottom:"4px"}}>閲覧中</div>
                  <div style={{fontSize:"18px", fontWeight:700, color:"#fff", fontFamily:"Kaisei Opti,serif"}}>{student.email} の受験情報</div>
                </div>
                <div style={{display:"flex", gap:"12px"}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"24px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#5eead4"}}>{student.targets.length}</div>
                    <div style={{fontSize:"10px", color:"rgba(255,255,255,.5)"}}>志望校</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"24px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#fcd34d"}}>{student.tasks.length}</div>
                    <div style={{fontSize:"10px", color:"rgba(255,255,255,.5)"}}>残タスク</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"16px"}}>
              {/* 志望校リスト */}
              <div style={{background:"var(--surface)", borderRadius:"16px", border:"1.5px solid var(--border)", padding:"20px", boxShadow:"var(--sh-sm)"}}>
                <h3 style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"14px"}}>🎯 志望校リスト</h3>
                {student.targets.length === 0 ? (
                  <p style={{fontSize:"12px", color:"var(--ink3)", textAlign:"center", padding:"16px 0"}}>まだ志望校が登録されていません</p>
                ) : (
                  <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                    {student.targets.map((u, i) => (
                      <div key={u.id} style={{display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"var(--surface2)", borderRadius:"10px"}}>
                        <div style={{width:"22px", height:"22px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, color:"#fff", flexShrink:0}}>{i+1}</div>
                        <div style={{flex:1, minWidth:0}}>
                          <p style={{fontSize:"12px", fontWeight:600, color:"var(--ink)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{u.university_name}</p>
                          {u.faculty_name && <p style={{fontSize:"10px", color:"var(--ink2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{u.faculty_name}</p>}
                          {u.department && <p style={{fontSize:"10px", color:"var(--ink3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{u.department}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 直近のタスク */}
              <div style={{background:"var(--surface)", borderRadius:"16px", border:"1.5px solid var(--border)", padding:"20px", boxShadow:"var(--sh-sm)"}}>
                <h3 style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"14px"}}>✅ 直近のタスク</h3>
                {student.tasks.length === 0 ? (
                  <p style={{fontSize:"12px", color:"var(--ink3)", textAlign:"center", padding:"16px 0"}}>完了待ちのタスクはありません</p>
                ) : (
                  <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                    {student.tasks.slice(0, 8).map(task => {
                      const days = task.due_date ? daysUntil(task.due_date) : null
                      const catStyle = categoryColor[task.category] || categoryColor["その他"]
                      return (
                        <div key={task.id} style={{padding:"10px 12px", background:"var(--surface2)", borderRadius:"10px"}}>
                          <p style={{fontSize:"12px", fontWeight:600, color:"var(--ink)", lineHeight:1.4, marginBottom:"5px"}}>{task.title}</p>
                          <div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
                            {task.category && (
                              <span style={{fontSize:"10px", padding:"1px 7px", borderRadius:"20px", fontWeight:600, background:catStyle.bg, color:catStyle.text}}>
                                {task.category}
                              </span>
                            )}
                            {days !== null && (
                              <span style={{fontSize:"10px", fontWeight:600, color: days <= 0 ? "#dc2626" : days <= 7 ? "#dc2626" : days <= 14 ? "#d97706" : "var(--ink3)"}}>
                                {days <= 0 ? "⚠️ 期限超過" : `あと${days}日`}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 費用サマリー */}
              <div style={{background:"var(--surface)", borderRadius:"16px", border:"1.5px solid var(--border)", padding:"20px", boxShadow:"var(--sh-sm)"}}>
                <h3 style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"14px"}}>💰 費用の目安</h3>
                <div style={{background:"var(--surface2)", borderRadius:"10px", padding:"14px", marginBottom:"10px"}}>
                  <div style={{fontSize:"11px", color:"var(--ink3)", marginBottom:"4px"}}>受験料合計（推定）</div>
                  <div style={{fontFamily:"DM Mono,monospace", fontSize:"24px", fontWeight:700, color:"var(--teal)"}}>
                    ¥{(student.targets.length * 35000).toLocaleString()}
                  </div>
                  <div style={{fontSize:"10px", color:"var(--ink3)", marginTop:"2px"}}>※ 1校あたり約¥35,000として算出</div>
                </div>
                <div style={{background:"var(--surface2)", borderRadius:"10px", padding:"14px"}}>
                  <div style={{fontSize:"11px", color:"var(--ink3)", marginBottom:"4px"}}>登録志望校数</div>
                  <div style={{fontFamily:"DM Mono,monospace", fontSize:"28px", fontWeight:700, color:"var(--ink)"}}>{student.targets.length}<span style={{fontSize:"13px", fontWeight:400, color:"var(--ink3)", marginLeft:"4px"}}>校</span></div>
                </div>
              </div>

              {/* 直近の重要日程 */}
              <div style={{background:"var(--surface)", borderRadius:"16px", border:"1.5px solid var(--border)", padding:"20px", boxShadow:"var(--sh-sm)"}}>
                <h3 style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"14px"}}>📅 重要な日程</h3>
                {student.tasks.filter(t => ["試験", "出願", "エントリー"].includes(t.category)).length === 0 ? (
                  <p style={{fontSize:"12px", color:"var(--ink3)", textAlign:"center", padding:"16px 0"}}>登録された日程はありません</p>
                ) : (
                  <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                    {student.tasks
                      .filter(t => ["試験", "出願", "エントリー"].includes(t.category))
                      .slice(0, 6)
                      .map(task => {
                        const days = task.due_date ? daysUntil(task.due_date) : null
                        const dateStr = task.due_date
                          ? new Date(task.due_date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })
                          : ""
                        return (
                          <div key={task.id} style={{display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", background:days !== null && days <= 14 ? "#fff7ed" : "var(--surface2)", borderRadius:"10px", borderLeft:`3px solid ${task.category === "試験" ? "#dc2626" : task.category === "出願" ? "#c2410c" : "#7c3aed"}`}}>
                            <div style={{minWidth:"36px", textAlign:"center"}}>
                              <div style={{fontFamily:"DM Mono,monospace", fontSize:"13px", fontWeight:700, color:"var(--ink)"}}>{dateStr}</div>
                            </div>
                            <div style={{flex:1, minWidth:0}}>
                              <p style={{fontSize:"11px", fontWeight:600, color:"var(--ink)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{task.title}</p>
                            </div>
                            {days !== null && days <= 14 && (
                              <span style={{fontSize:"10px", fontWeight:700, color:days <= 7 ? "#dc2626" : "#d97706", flexShrink:0}}>あと{days}日</span>
                            )}
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 注記 */}
        {linked && (
          <p style={{fontSize:"11px", color:"var(--ink4)", textAlign:"center", marginTop:"24px"}}>
            ※ この画面はお子さんの情報を閲覧専用で表示しています
          </p>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
