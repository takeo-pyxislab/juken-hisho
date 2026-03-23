"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

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
  enrollment_deadline: string
  result_date: string
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
  const [activeTab, setActiveTab] = useState("list")

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

  const totalPages = Math.ceil(total / 20)

  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
      {/* ナビ */}
      <nav style={{
        position:"sticky", top:0, zIndex:300, height:"58px", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(248,247,244,.94)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:"9px", textDecoration:"none"}}>
          <div style={{width:"30px", height:"30px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px"}}>📖</div>
          <div>
            <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"16px", fontWeight:700, color:"var(--ink)"}}>受験秘書</div>
            <div style={{fontSize:"10px", color:"var(--ink3)"}}>総合型選抜ナビ</div>
          </div>
        </Link>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <span style={{fontSize:"12px", color:"var(--ink3)"}}>{total.toLocaleString()}件</span>
          <Link href="/login" style={{padding:"6px 12px", borderRadius:"8px", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none"}}>ログイン</Link>
          <Link href="/signup" style={{padding:"7px 16px", borderRadius:"8px", background:"var(--premium)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>無料登録</Link>
        </div>
      </nav>

      <div style={{display:"flex", height:"calc(100vh - 58px)"}}>
        {/* サイドバー */}
        <div style={{
          width:"280px", minWidth:"280px",
          background:"var(--surface)", borderRight:"1px solid var(--border)",
          display:"flex", flexDirection:"column", overflow:"hidden"
        }}>
          {/* 検索 */}
          <div style={{padding:"12px", borderBottom:"1px solid var(--border)"}}>
            <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"6px"}}>キーワード</div>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search(1)}
              placeholder="大学名・学部名..."
              style={{
                background:"var(--surface2)", border:"1.5px solid var(--border)",
                borderRadius:"8px", padding:"8px 11px", color:"var(--ink)",
                fontSize:"12px", width:"100%", outline:"none", fontFamily:"inherit"
              }}
            />
          </div>

          {/* 都道府県 */}
          <div style={{padding:"12px", borderBottom:"1px solid var(--border)"}}>
            <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"6px"}}>都道府県</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
              {["東京","神奈川","大阪","京都","愛知","福岡"].map(p => (
                <button key={p} onClick={() => { setPrefecture(prefecture === p ? "" : p) }}
                  style={{
                    padding:"3px 9px", borderRadius:"20px",
                    border:`1.5px solid ${prefecture === p ? "var(--teal)" : "var(--border)"}`,
                    background: prefecture === p ? "rgba(13,148,136,.08)" : "transparent",
                    color: prefecture === p ? "var(--teal)" : "var(--ink3)",
                    fontSize:"10px", cursor:"pointer", fontWeight:600, fontFamily:"inherit"
                  }}>
                  {p}
                </button>
              ))}
              <select value={prefecture} onChange={e => setPrefecture(e.target.value)}
                style={{
                  padding:"3px 6px", borderRadius:"6px",
                  border:"1.5px solid var(--border)", background:"transparent",
                  color:"var(--ink3)", fontSize:"10px", cursor:"pointer"
                }}>
                <option value="">全国</option>
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* 学部系統 */}
          <div style={{padding:"12px", borderBottom:"1px solid var(--border)"}}>
            <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"6px"}}>学部系統</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(category === c ? "" : c)}
                  style={{
                    padding:"3px 9px", borderRadius:"20px",
                    border:`1.5px solid ${category === c ? "var(--teal)" : "var(--border)"}`,
                    background: category === c ? "rgba(13,148,136,.08)" : "transparent",
                    color: category === c ? "var(--teal)" : "var(--ink3)",
                    fontSize:"10px", cursor:"pointer", fontWeight:600, fontFamily:"inherit"
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* その他フィルター */}
          <div style={{padding:"12px", borderBottom:"1px solid var(--border)"}}>
            <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"6px"}}>共通テスト</div>
            <div style={{display:"flex", gap:"4px"}}>
              {["あり","なし"].map(v => (
                <button key={v} onClick={() => setKyotsuu(kyotsuu === v ? "" : v)}
                  style={{
                    flex:1, padding:"5px", borderRadius:"7px",
                    border:`1.5px solid ${kyotsuu === v ? "var(--teal)" : "var(--border)"}`,
                    background: kyotsuu === v ? "rgba(13,148,136,.08)" : "transparent",
                    color: kyotsuu === v ? "var(--teal)" : "var(--ink3)",
                    fontSize:"11px", cursor:"pointer", fontWeight:600, fontFamily:"inherit"
                  }}>
                  {v}
                </button>
              ))}
            </div>
            <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"6px", marginTop:"10px"}}>出願区分</div>
            <div style={{display:"flex", gap:"4px"}}>
              {["専願","併願"].map(v => (
                <button key={v} onClick={() => setAppType(appType === v ? "" : v)}
                  style={{
                    flex:1, padding:"5px", borderRadius:"7px",
                    border:`1.5px solid ${appType === v ? "var(--teal)" : "var(--border)"}`,
                    background: appType === v ? "rgba(13,148,136,.08)" : "transparent",
                    color: appType === v ? "var(--teal)" : "var(--ink3)",
                    fontSize:"11px", cursor:"pointer", fontWeight:600, fontFamily:"inherit"
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* 検索ボタン */}
          <div style={{padding:"12px", borderBottom:"1px solid var(--border)"}}>
            <button onClick={() => search(1)} disabled={loading}
              style={{
                width:"100%", background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                border:"none", borderRadius:"10px", padding:"10px",
                color:"#fff", fontSize:"13px", fontWeight:700,
                cursor:loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1, fontFamily:"inherit"
              }}>
              {loading ? "検索中..." : "🔍 検索する"}
            </button>
            {(keyword || prefecture || category || kyotsuu || appType) && (
              <button onClick={() => { setKeyword(""); setPrefecture(""); setCategory(""); setKyotsuu(""); setAppType(""); setTimeout(() => search(1), 100) }}
                style={{
                  width:"100%", marginTop:"6px", background:"transparent",
                  border:"1.5px solid var(--border)", borderRadius:"8px", padding:"7px",
                  color:"var(--ink3)", fontSize:"11px", cursor:"pointer", fontFamily:"inherit"
                }}>
                クリア
              </button>
            )}
          </div>

          {/* CTAバナー */}
          <div style={{padding:"12px", marginTop:"auto"}}>
            <div style={{
              background:"linear-gradient(135deg,var(--premium),#2d2825)",
              borderRadius:"12px", padding:"16px"
            }}>
              <div style={{fontSize:"13px", fontWeight:800, color:"#fff", marginBottom:"4px"}}>✦ AI診断を使う</div>
              <div style={{fontSize:"11px", color:"rgba(255,255,255,.6)", lineHeight:1.6, marginBottom:"12px"}}>問診に答えるだけで、あなたに合う大学をAIが提案。</div>
              <Link href="/signup" style={{
                display:"block", padding:"9px", borderRadius:"8px",
                background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                color:"#fff", fontSize:"12px", fontWeight:700,
                textDecoration:"none", textAlign:"center"
              }}>
                無料で始める
              </Link>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div style={{flex:1, overflow:"auto", background:"var(--bg)"}}>
          {/* タブバー */}
          <div style={{
            background:"var(--surface)", borderBottom:"1px solid var(--border)",
            padding:"10px 16px", display:"flex", alignItems:"center", gap:"8px",
            position:"sticky", top:0, zIndex:100, boxShadow:"var(--sh-sm)"
          }}>
            <div style={{display:"flex", gap:"3px", background:"var(--surface2)", borderRadius:"9px", padding:"3px"}}>
              {[{id:"list", label:"一覧"}, {id:"date", label:"日程"}, {id:"cost", label:"費用"}].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{
                    padding:"6px 14px", borderRadius:"7px", border:"none",
                    background: activeTab === t.id ? "var(--surface)" : "transparent",
                    color: activeTab === t.id ? "var(--teal)" : "var(--ink2)",
                    fontSize:"11px", fontWeight:700, cursor:"pointer",
                    fontFamily:"inherit",
                    boxShadow: activeTab === t.id ? "var(--sh-sm)" : "none"
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
            <span style={{fontSize:"11px", color:"var(--ink3)", marginLeft:"auto"}}>
              {total.toLocaleString()}件中 {Math.min((page-1)*20+1, total)}〜{Math.min(page*20, total)}件
            </span>
          </div>

          <div style={{padding:"16px 20px"}}>
            {loading ? (
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"200px", gap:"12px"}}>
                <div style={{width:"32px", height:"32px", border:"3px solid var(--border)", borderTopColor:"var(--teal)", borderRadius:"50%", animation:"spin .7s linear infinite"}}/>
                <p style={{fontSize:"13px", color:"var(--ink3)"}}>検索中...</p>
              </div>
            ) : results.length === 0 ? (
              <div style={{textAlign:"center", padding:"60px 20px"}}>
                <div style={{fontSize:"48px", marginBottom:"16px", opacity:.6}}>🔍</div>
                <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", color:"var(--ink)", marginBottom:"8px"}}>該当する大学が見つかりません</div>
                <div style={{fontSize:"13px", color:"var(--ink2)"}}>条件を変えて検索してみてください</div>
              </div>
            ) : (
              <>
                {activeTab === "list" && (
                  <div>
                    {results.map(u => (
                      <div key={u.id} style={{
                        background:"var(--surface)", border:"1.5px solid var(--border)",
                        borderRadius:"14px", marginBottom:"10px", overflow:"hidden",
                        boxShadow:"var(--sh-sm)"
                      }}>
                        <div style={{
                          padding:"12px 16px",
                          background:"linear-gradient(135deg,rgba(13,148,136,.03),rgba(6,182,212,.03))",
                          borderBottom:"1px solid var(--border)",
                          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px"
                        }}>
                          <div>
                            <div style={{fontSize:"14px", fontWeight:800, color:"var(--ink)"}}>{u.university_name}</div>
                            <div style={{fontSize:"12px", color:"var(--teal)", marginTop:"2px"}}>{u.faculty_name} {u.department_name}</div>
                          </div>
                          <div style={{display:"flex", gap:"5px", flexWrap:"wrap"}}>
                            <span style={{fontSize:"10px", padding:"2px 8px", borderRadius:"20px", background:"var(--surface2)", color:"var(--ink3)", fontWeight:700}}>{u.prefecture}</span>
                            {u.has_kyotsuu === "あり" && <span style={{fontSize:"10px", padding:"2px 8px", borderRadius:"20px", background:"var(--blue-bg)", color:"var(--blue)", border:"1px solid var(--blue-border)", fontWeight:700}}>共通テスト</span>}
                            {u.application_type === "専願" && <span style={{fontSize:"10px", padding:"2px 8px", borderRadius:"20px", background:"var(--rose-bg)", color:"var(--rose)", border:"1px solid var(--rose-border)", fontWeight:700}}>専願</span>}
                            {u.application_type === "併願" && <span style={{fontSize:"10px", padding:"2px 8px", borderRadius:"20px", background:"var(--teal-bg)", color:"var(--teal2)", border:"1px solid var(--teal-border)", fontWeight:700}}>併願可</span>}
                          </div>
                        </div>
                        <table style={{width:"100%", borderCollapse:"collapse"}}>
                          <tbody>
                            <tr>
                              <td style={{padding:"8px 12px", fontSize:"10px", fontWeight:700, color:"var(--ink3)", background:"var(--surface2)", width:"80px", textTransform:"uppercase", letterSpacing:".05em"}}>入試方式</td>
                              <td style={{padding:"8px 12px", fontSize:"11px", color:"var(--ink2)"}}>{u.exam_type}</td>
                              <td style={{padding:"8px 12px", fontSize:"10px", fontWeight:700, color:"var(--ink3)", background:"var(--surface2)", width:"80px"}}>出願期間</td>
                              <td style={{padding:"8px 12px", fontSize:"11px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.5}}>{u.application_start?.slice(0,60) || "—"}</td>
                            </tr>
                            <tr style={{borderTop:"1px solid rgba(0,0,0,.04)"}}>
                              <td style={{padding:"8px 12px", fontSize:"10px", fontWeight:700, color:"var(--ink3)", background:"var(--surface2)"}}>試験日程</td>
                              <td style={{padding:"8px 12px", fontSize:"11px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.5}}>{u.exam_date?.slice(0,80) || "—"}</td>
                              <td style={{padding:"8px 12px", fontSize:"10px", fontWeight:700, color:"var(--ink3)", background:"var(--surface2)"}}>結果発表</td>
                              <td style={{padding:"8px 12px", fontSize:"11px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.5}}>{u.result_date?.slice(0,60) || "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "date" && (
                  <div>
                    <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", overflow:"hidden", boxShadow:"var(--sh-sm)"}}>
                      <table style={{width:"100%", borderCollapse:"collapse"}}>
                        <thead>
                          <tr>
                            {["大学名","学部・学科","入試方式","出願期間","試験日","結果発表","手続締切"].map(h => (
                              <th key={h} style={{padding:"8px 10px", textAlign:"left", fontSize:"9px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", background:"var(--surface2)", borderBottom:"1px solid var(--border)", whiteSpace:"nowrap"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {results.map(u => (
                            <tr key={u.id} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                              <td style={{padding:"8px 10px", fontWeight:700, color:"var(--ink)", fontSize:"11px", whiteSpace:"nowrap"}}>{u.university_name}</td>
                              <td style={{padding:"8px 10px", fontSize:"10px", color:"var(--ink2)"}}>{u.faculty_name}<br/><span style={{color:"var(--ink3)"}}>{u.department_name}</span></td>
                              <td style={{padding:"8px 10px", fontSize:"10px", color:"var(--ink2)"}}>{u.exam_type?.slice(0,20) || "—"}</td>
                              <td style={{padding:"8px 10px", fontSize:"10px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.4}}>{u.application_start?.slice(0,50) || "—"}</td>
                              <td style={{padding:"8px 10px", fontSize:"10px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.4}}>{u.exam_date?.slice(0,50) || "—"}</td>
                              <td style={{padding:"8px 10px", fontSize:"10px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.4}}>{u.result_date?.slice(0,40) || "—"}</td>
                              <td style={{padding:"8px 10px", fontSize:"10px", color:"var(--ink2)", whiteSpace:"pre-line", lineHeight:1.4}}>{u.enrollment_deadline?.slice(0,40) || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "cost" && (
                  <div>
                    <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", overflow:"hidden", boxShadow:"var(--sh-sm)"}}>
                      <table style={{width:"100%", borderCollapse:"collapse"}}>
                        <thead>
                          <tr>
                            {["大学名","学部・学科","費用情報","区分","エリア"].map(h => (
                              <th key={h} style={{padding:"8px 12px", textAlign:"left", fontSize:"9px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", background:"var(--surface2)", borderBottom:"1px solid var(--border)"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {results.map(u => (
                            <tr key={u.id} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                              <td style={{padding:"10px 12px", fontWeight:700, color:"var(--ink)", fontSize:"12px"}}>{u.university_name}</td>
                              <td style={{padding:"10px 12px", fontSize:"11px", color:"var(--ink2)"}}>{u.faculty_name}</td>
                              <td style={{padding:"10px 12px", fontSize:"10px", color:"var(--ink2)", fontFamily:"DM Mono,monospace", whiteSpace:"pre-line", lineHeight:1.6}}>{u.cost?.slice(0,100) || "no data"}</td>
                              <td style={{padding:"10px 12px"}}><span style={{fontSize:"10px", padding:"2px 7px", borderRadius:"20px", background: u.application_type === "専願" ? "var(--rose-bg)" : "var(--teal-bg)", color: u.application_type === "専願" ? "var(--rose)" : "var(--teal2)", fontWeight:700}}>{u.application_type || "—"}</span></td>
                              <td style={{padding:"10px 12px", fontSize:"11px", color:"var(--ink3)"}}>{u.prefecture}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ページネーション */}
                <div style={{display:"flex", justifyContent:"center", gap:"6px", marginTop:"20px"}}>
                  {page > 1 && (
                    <button onClick={() => search(page - 1)}
                      style={{padding:"7px 14px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"8px", fontSize:"12px", cursor:"pointer", fontFamily:"inherit", color:"var(--ink2)"}}>
                      ← 前
                    </button>
                  )}
                  <span style={{padding:"7px 14px", fontSize:"12px", color:"var(--ink3)"}}>
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <button onClick={() => search(page + 1)}
                      style={{padding:"7px 14px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"8px", fontSize:"12px", cursor:"pointer", fontFamily:"inherit", color:"var(--ink2)"}}>
                      次 →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}