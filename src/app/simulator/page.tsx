"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

type UniName = {
  name: string
  cats: string[]
  hasHeigan: boolean
  hasSengan: boolean
}

type URecord = {
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

type UniGroup = { name: string; records: URecord[] }

const PREFS: Record<string, string[]> = {
  "北海道・東北": ["北海道","青森","岩手","宮城","秋田","山形","福島"],
  "関東": ["茨城","栃木","群馬","埼玉","千葉","東京","神奈川"],
  "中部": ["新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重"],
  "近畿": ["滋賀","京都","大阪","兵庫","奈良","和歌山"],
  "中国・四国": ["鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知"],
  "九州・沖縄": ["福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"],
}

const MN = ["4月","5月","6月","7月","8月","9月","10月","11月","12月","1月","2月","3月"]
const MI: Record<string, number> = {"4":0,"5":1,"6":2,"7":3,"8":4,"9":5,"10":6,"11":7,"12":8,"1":9,"2":10,"3":11}

function mRange(val: string | null) {
  if (!val || val === "no data") return null
  let mn = 12, mx = -1
  Object.entries(MI).forEach(([m, i]) => {
    if (val.includes(m + "月")) { if (i < mn) mn = i; if (i > mx) mx = i }
  })
  return mx >= 0 ? { s: mn, e: mx } : null
}

function parseCost(raw: string) {
  const s = String(raw || "").replace(/\\n/g, "\n")
  const get = (ks: string[]) => {
    for (const k of ks) {
      const m = s.match(new RegExp(k + "[：: ]*([\\d,]+)円"))
      if (m) return parseInt(m[1].replace(/,/g, ""))
    }
    return 0
  }
  return { exam: get(["受験費用","検定料","入学検定料","受験料"]), nyuugaku: get(["入学金"]), jugyou: get(["授業料"]) }
}

function fmt(n: number) { return n.toLocaleString("ja-JP") }

export default function SimulatorPage() {
  const [uniNames, setUniNames] = useState<UniName[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [simData, setSimData] = useState<UniGroup[]>([])
  const [simLoading, setSimLoading] = useState(false)
  const [simRunning, setSimRunning] = useState(false)
  const [sideTab, setSideTab] = useState<"s"|"f">("s")
  const [rightTab, setRightTab] = useState<"detail"|"timeline"|"cost"|"heigan"|"parent">("detail")
  const [keyword, setKeyword] = useState("")
  const [region, setRegion] = useState("")
  const [pref, setPref] = useState("")
  const [facCategory, setFacCategory] = useState("")
  const [ougan, setOugan] = useState("")
  const [kyotsuu, setKyotsuu] = useState("")

  const fetchNames = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set("keyword", keyword)
    if (pref) params.set("prefecture", pref)
    if (facCategory) params.set("category", facCategory)
    if (ougan) params.set("app_type", ougan)
    if (kyotsuu) params.set("kyotsuu", kyotsuu)
    const res = await fetch(`/api/university-names?${params}`)
    const data = await res.json()
    setUniNames(data.empty ? [] : (data.data || []))
    setLoading(false)
  }, [keyword, pref, facCategory, ougan, kyotsuu])

  useEffect(() => {
    const t = setTimeout(fetchNames, 300)
    return () => clearTimeout(t)
  }, [fetchNames])

  const toggleSelect = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const runSimulation = async () => {
    if (selected.size === 0) return
    setSimLoading(true)
    setSimRunning(true)
    const names = [...selected]
    const results: UniGroup[] = []
    for (const name of names) {
      const res = await fetch(`/api/universities?keyword=${encodeURIComponent(name)}&limit=50`)
      const data = await res.json()
      const records = (data.data || []).filter((r: URecord) => r.university_name === name)
      results.push({ name, records })
    }
    setSimData(results)
    setSimLoading(false)
  }

  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
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
          <Link href="/login" style={{padding:"6px 12px", borderRadius:"8px", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none"}}>ログイン</Link>
          <Link href="/signup" style={{padding:"7px 16px", borderRadius:"8px", background:"var(--premium)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>✦ プレミアム登録</Link>
        </div>
      </nav>

      <div style={{display:"flex", height:"calc(100vh - 58px)"}}>
        {/* サイドバー */}
        <div style={{width:"300px", minWidth:"300px", background:"var(--surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", overflow:"hidden"}}>
          {/* タブ */}
          <div style={{display:"flex", borderBottom:"1px solid var(--border)"}}>
            {[{id:"s" as const, label:"🔍 検索"}, {id:"f" as const, label:"⚙ 絞込"}].map(t => (
              <button key={t.id} onClick={() => setSideTab(t.id)} style={{
                flex:1, padding:"11px 4px", textAlign:"center", fontSize:"11px", fontWeight:700,
                cursor:"pointer", background:"transparent", border:"none", fontFamily:"inherit",
                color: sideTab === t.id ? "var(--teal)" : "var(--ink3)",
                borderBottom: `2px solid ${sideTab === t.id ? "var(--teal)" : "transparent"}`,
                letterSpacing:".04em"
              }}>{t.label}</button>
            ))}
          </div>

          {/* 検索 */}
          {sideTab === "s" && (
            <div style={{padding:"12px", borderBottom:"1px solid var(--border)"}}>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="🔍 大学名・学部名で検索..."
                style={{background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:"8px", padding:"8px 11px", color:"var(--ink)", fontSize:"12px", fontFamily:"inherit", outline:"none", width:"100%"}} />
            </div>
          )}

          {/* 絞込 */}
          {sideTab === "f" && (
            <div style={{padding:"12px", borderBottom:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:"10px", overflowY:"auto", maxHeight:"300px"}}>
              <div>
                <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"4px"}}>地域</div>
                <select value={region} onChange={e => { setRegion(e.target.value); setPref("") }}
                  style={{background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:"8px", padding:"7px 10px", color:"var(--ink)", fontSize:"12px", width:"100%", fontFamily:"inherit"}}>
                  <option value="">すべての地域</option>
                  {Object.keys(PREFS).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"4px"}}>都道府県</div>
                <select value={pref} onChange={e => setPref(e.target.value)}
                  style={{background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:"8px", padding:"7px 10px", color:"var(--ink)", fontSize:"12px", width:"100%", fontFamily:"inherit"}}>
                  <option value="">すべて</option>
                  {(region ? PREFS[region] || [] : Object.values(PREFS).flat()).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"4px"}}>学部系統</div>
                <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
                  {[{v:"",l:"すべて"},{v:"文系・国際",l:"文系"},{v:"理工・情報",l:"理系"},{v:"医療・保健",l:"医療"},{v:"教育",l:"教育"},{v:"芸術・スポーツ",l:"芸術"},{v:"農・食・環境",l:"農食"}].map(c => (
                    <button key={c.v} onClick={() => setFacCategory(c.v)} style={{
                      padding:"3px 9px", borderRadius:"20px", fontFamily:"inherit",
                      border:`1.5px solid ${facCategory===c.v?"var(--teal)":"var(--border)"}`,
                      background: facCategory===c.v?"rgba(13,148,136,.08)":"transparent",
                      color: facCategory===c.v?"var(--teal)":"var(--ink3)",
                      fontSize:"10px", cursor:"pointer", fontWeight:600
                    }}>{c.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"4px"}}>出願区分</div>
                <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
                  {[{v:"",l:"すべて"},{v:"専願",l:"専願のみ"},{v:"併願",l:"併願可"}].map(c => (
                    <button key={c.v} onClick={() => setOugan(c.v)} style={{
                      padding:"3px 9px", borderRadius:"20px", fontFamily:"inherit",
                      border:`1.5px solid ${ougan===c.v?"var(--teal)":"var(--border)"}`,
                      background: ougan===c.v?"rgba(13,148,136,.08)":"transparent",
                      color: ougan===c.v?"var(--teal)":"var(--ink3)",
                      fontSize:"10px", cursor:"pointer", fontWeight:600
                    }}>{c.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:"10px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"4px"}}>共通テスト</div>
                <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
                  {[{v:"",l:"すべて"},{v:"あり",l:"あり"},{v:"なし",l:"なし"}].map(c => (
                    <button key={c.v} onClick={() => setKyotsuu(c.v)} style={{
                      padding:"3px 9px", borderRadius:"20px", fontFamily:"inherit",
                      border:`1.5px solid ${kyotsuu===c.v?"var(--teal)":"var(--border)"}`,
                      background: kyotsuu===c.v?"rgba(13,148,136,.08)":"transparent",
                      color: kyotsuu===c.v?"var(--teal)":"var(--ink3)",
                      fontSize:"10px", cursor:"pointer", fontWeight:600
                    }}>{c.l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 大学リスト */}
          <div style={{flex:1, overflowY:"auto", padding:"6px"}}>
            {loading ? (
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100px", gap:"8px"}}>
                <div style={{width:"24px", height:"24px", border:"3px solid var(--border)", borderTopColor:"var(--teal)", borderRadius:"50%", animation:"spin .7s linear infinite"}}/>
                <span style={{fontSize:"11px", color:"var(--ink3)"}}>読み込み中...</span>
              </div>
            ) : uniNames.length === 0 ? (
              <div style={{padding:"30px 14px", textAlign:"center", color:"var(--ink3)"}}>
                <div style={{fontSize:"32px", marginBottom:"10px"}}>🔍</div>
                <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px"}}>大学名で検索してください</div>
                <div style={{fontSize:"11px", lineHeight:1.8, color:"var(--ink3)"}}>
                  例：「早稲田」「看護」「東京」<br/>
                  「医療」「国際」など
                </div>
              </div>
            ) : (
              uniNames.map(u => {
                const sel = selected.has(u.name)
                const tagColor = (!u.hasHeigan && u.hasSengan) ? {bg:"rgba(239,68,68,.1)", color:"#e11d48"} :
                  u.hasHeigan ? {bg:"rgba(13,148,136,.1)", color:"var(--teal2)"} :
                  {bg:"var(--surface2)", color:"var(--ink3)"}
                const tagLabel = (!u.hasHeigan && u.hasSengan) ? "専願" : u.hasHeigan ? "併願可" : "要確認"
                return (
                  <div key={u.name} onClick={() => toggleSelect(u.name)} style={{
                    padding:"8px 10px", borderRadius:"8px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:"8px",
                    border:`1.5px solid ${sel?"rgba(13,148,136,.22)":"transparent"}`,
                    background: sel?"rgba(13,148,136,.06)":"transparent",
                    marginBottom:"2px", transition:".15s"
                  }}>
                    <div style={{
                      width:"18px", height:"18px", minWidth:"18px", borderRadius:"5px",
                      border:`1.5px solid ${sel?"var(--teal)":"var(--border)"}`,
                      background: sel?"var(--teal)":"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"9px", color:"#fff", transition:".15s"
                    }}>{sel?"✓":""}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:"12px", fontWeight:600, color:"var(--ink)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{u.name}</div>
                      <div style={{fontSize:"10px", color:"var(--ink3)", display:"flex", gap:"4px", marginTop:"1px", flexWrap:"wrap"}}>
                        <span style={{padding:"1px 5px", borderRadius:"3px", fontSize:"9px", fontWeight:700, background:tagColor.bg, color:tagColor.color}}>{tagLabel}</span>
                        {u.cats.slice(0,1).map(c => <span key={c} style={{padding:"1px 5px", borderRadius:"3px", fontSize:"9px", fontWeight:700, background:"var(--surface2)", color:"var(--ink3)"}}>{c}</span>)}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* フッター */}
          <div style={{padding:"12px", borderTop:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:"7px"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <span style={{fontSize:"11px", color:"var(--ink2)"}}>選択中</span>
              <div>
                <span style={{fontSize:"20px", fontWeight:900, color:"var(--teal)", fontFamily:"DM Mono,monospace"}}>{selected.size}</span>
                <span style={{fontSize:"11px", color:"var(--ink3)"}}> 校</span>
              </div>
            </div>
            <button onClick={runSimulation} disabled={selected.size===0||simLoading} style={{
              width:"100%", background:"linear-gradient(135deg,var(--teal),#06b6d4)",
              border:"none", borderRadius:"10px", padding:"10px",
              color:"#fff", fontSize:"12px", fontWeight:700, fontFamily:"inherit",
              cursor: selected.size===0?"not-allowed":"pointer",
              opacity: selected.size===0?0.4:1
            }}>{simLoading?"読み込み中...":"シミュレーション開始 →"}</button>
            <button onClick={() => { setSelected(new Set()); setSimRunning(false); setSimData([]) }} style={{
              width:"100%", background:"transparent", border:"1.5px solid var(--border)",
              borderRadius:"8px", padding:"7px", color:"var(--ink3)", fontSize:"11px",
              cursor:"pointer", fontFamily:"inherit"
            }}>選択をクリア</button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div style={{flex:1, overflowY:"auto", background:"var(--bg)"}}>
          {!simRunning ? (
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%", padding:"40px"}}>
              <div style={{textAlign:"center", maxWidth:"440px"}}>
                <div style={{fontSize:"52px", marginBottom:"16px", opacity:.6}}>🗺️</div>
                <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:800, color:"var(--ink)", marginBottom:"8px"}}>志望大学を選んでシミュレーション</div>
                <div style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"20px"}}>左のリストから大学を選択して「シミュレーション開始」を押すと、日程・費用・併願可否を一覧比較できます。</div>
                <Link href="/" style={{display:"inline-block", padding:"10px 22px", borderRadius:"10px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>← ホームに戻る</Link>
              </div>
            </div>
          ) : simLoading ? (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"200px", gap:"12px"}}>
              <div style={{width:"32px", height:"32px", border:"3px solid var(--border)", borderTopColor:"var(--teal)", borderRadius:"50%", animation:"spin .7s linear infinite"}}/>
              <p style={{fontSize:"13px", color:"var(--ink3)"}}>シミュレーション中...</p>
            </div>
          ) : (
            <SimResult data={simData} rightTab={rightTab} setRightTab={setRightTab} />
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function SimResult({ data, rightTab, setRightTab }: {
  data: UniGroup[]
  rightTab: string
  setRightTab: (t: any) => void
}) {
  const sOnly = data.filter(u => u.records.every(r => r.application_type === "専願"))
  const hOk = data.filter(u => u.records.some(r => r.application_type === "併願"))
  let eSum = 0
  data.forEach(u => { const c = parseCost(u.records[0]?.cost || ""); eSum += c.exam || 0 })

  return (
    <div>
      <div style={{background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"11px 20px", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", position:"sticky", top:0, zIndex:100, boxShadow:"var(--sh-sm)"}}>
        <div style={{fontSize:"13px", fontWeight:700, marginRight:"auto"}}>📊 {data.length}大学 / {data.reduce((s,u) => s+u.records.length, 0)}学科</div>
        <div style={{display:"flex", gap:"3px", background:"var(--surface2)", borderRadius:"9px", padding:"3px"}}>
          {[{id:"detail",l:"📋 詳細"},{id:"timeline",l:"📅 日程"},{id:"cost",l:"💰 費用"},{id:"heigan",l:"⚡ 併願"},{id:"parent",l:"👨‍👩‍👧 保護者"}].map(t => (
            <button key={t.id} onClick={() => setRightTab(t.id)} style={{
              padding:"6px 12px", borderRadius:"7px", border:"none", fontFamily:"inherit",
              background: rightTab===t.id?"var(--surface)":"transparent",
              color: rightTab===t.id?"var(--teal)":"var(--ink2)",
              fontSize:"11px", fontWeight:700, cursor:"pointer", whiteSpace:"nowrap",
              boxShadow: rightTab===t.id?"var(--sh-sm)":"none"
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px", padding:"16px 20px"}}>
        {[
          {l:"選択大学", v:data.length, sub:"校", color:"var(--blue)", grad:"linear-gradient(90deg,var(--blue),#818cf8)"},
          {l:"専願のみ", v:sOnly.length, sub:"校（要注意）", color:"#e11d48", grad:"linear-gradient(90deg,#e11d48,#ec4899)"},
          {l:"併願可能", v:hOk.length, sub:"校", color:"var(--teal)", grad:"linear-gradient(90deg,var(--teal),#06b6d4)"},
          {l:"受験料目安", v:eSum>0?Math.round(eSum/10000)+"万":"—", sub:eSum>0?"円（概算）":"", color:"var(--amber)", grad:"linear-gradient(90deg,var(--amber),#f97316)"},
        ].map((k,i) => (
          <div key={i} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"14px", position:"relative", overflow:"hidden"}}>
            <div style={{position:"absolute", top:0, left:0, right:0, height:"2px", background:k.grad}}/>
            <div style={{fontSize:"9px", color:"var(--ink3)", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"6px"}}>{k.l}</div>
            <div style={{fontSize:"26px", fontWeight:900, fontFamily:"DM Mono,monospace", lineHeight:1, color:k.color}}>{k.v}</div>
            <div style={{fontSize:"10px", color:"var(--ink3)", marginTop:"3px"}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"0 20px 28px"}}>
        {rightTab === "detail" && <DetailTab data={data} />}
        {rightTab === "timeline" && <TimelineTab data={data} />}
        {rightTab === "cost" && <CostTab data={data} />}
        {rightTab === "heigan" && <HeiganTab data={data} />}
        {rightTab === "parent" && <ParentTab data={data} />}
      </div>

      <div style={{padding:"0 20px 20px"}}>
        <div style={{background:"linear-gradient(135deg,var(--premium),#2d2825)", borderRadius:"16px", padding:"24px", display:"flex", alignItems:"center", gap:"20px", flexWrap:"wrap"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:"15px", fontWeight:800, color:"#fff", marginBottom:"4px"}}>✦ 「自分はどこを受ければいいの？」を解決しませんか？</div>
            <div style={{fontSize:"12px", color:"rgba(255,255,255,.6)", lineHeight:1.6}}>AI問診でプロフィールを作成すると、あなたに合った大学・選抜方法・穴場校をサジェストします。</div>
          </div>
          <Link href="/signup" style={{flexShrink:0, padding:"11px 24px", borderRadius:"9px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", whiteSpace:"nowrap"}}>プレミアムで診断する →</Link>
        </div>
      </div>
    </div>
  )
}

function DetailTab({ data }: { data: UniGroup[] }) {
  return (
    <div>
      {data.map(({ name, records }) => {
        const hasH = records.some(r => r.application_type === "併願")
        const hasS = records.some(r => r.application_type === "専願")
        return (
          <div key={name} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", marginBottom:"12px", overflow:"hidden", boxShadow:"var(--sh-sm)"}}>
            <div style={{padding:"12px 16px", background:"linear-gradient(135deg,rgba(13,148,136,.03),rgba(6,182,212,.03))", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div style={{fontSize:"14px", fontWeight:800, color:"var(--ink)", display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap"}}>
                🏫 {name}
                {(!hasH && hasS) ? <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"20px",background:"rgba(225,29,72,.08)",color:"#e11d48",border:"1px solid rgba(225,29,72,.15)",fontWeight:700}}>⚠ 専願のみ</span> :
                  hasH ? <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"20px",background:"rgba(13,148,136,.08)",color:"var(--teal2)",border:"1px solid rgba(13,148,136,.15)",fontWeight:700}}>✓ 併願可</span> : null}
              </div>
              <div style={{fontSize:"11px", color:"var(--ink3)"}}>{records.length}学科</div>
            </div>
            <table style={{width:"100%", borderCollapse:"collapse"}}>
              <thead>
                <tr>{["学部・学科","区分","出願期間","試験日程","結果発表","費用概算"].map(h => (
                  <th key={h} style={{padding:"7px 12px", textAlign:"left", fontSize:"9px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", background:"var(--surface2)", borderBottom:"1px solid var(--border)"}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const c = parseCost(r.cost)
                  const cs = c.exam > 0 ? `受験料 ${fmt(c.exam)}円` : (r.cost?.slice(0,30) || "no data")
                  return (
                    <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                      <td style={{padding:"10px 12px"}}><div style={{fontWeight:600,color:"var(--ink)",fontSize:"12px"}}>{r.faculty_name} {r.department_name}</div><div style={{fontSize:"10px",color:"var(--ink3)",marginTop:"1px"}}>{r.exam_type}</div></td>
                      <td style={{padding:"10px 12px"}}>
                        {r.application_type==="専願"?<span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"20px",background:"rgba(225,29,72,.08)",color:"#e11d48",border:"1px solid rgba(225,29,72,.15)",fontWeight:700}}>専願</span>:
                        r.application_type==="併願"?<span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"20px",background:"rgba(13,148,136,.08)",color:"var(--teal2)",border:"1px solid rgba(13,148,136,.15)",fontWeight:700}}>併願</span>:
                        <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"20px",background:"var(--surface2)",color:"var(--ink3)",fontWeight:700}}>{r.application_type}</span>}
                      </td>
                      <td style={{padding:"10px 12px",fontSize:"11px",color:"var(--ink2)",whiteSpace:"pre-line",lineHeight:1.6}}>{r.application_start?.slice(0,60)||"—"}</td>
                      <td style={{padding:"10px 12px",fontSize:"11px",color:"var(--ink2)",whiteSpace:"pre-line",lineHeight:1.6}}>{r.exam_date?.slice(0,60)||"—"}</td>
                      <td style={{padding:"10px 12px",fontSize:"11px",color:"var(--ink2)",whiteSpace:"pre-line",lineHeight:1.6}}>{r.result_date?.slice(0,40)||"—"}</td>
                      <td style={{padding:"10px 12px",fontSize:"10px",color:"var(--ink2)",fontFamily:"DM Mono,monospace"}}>{cs}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

function TimelineTab({ data }: { data: UniGroup[] }) {
  const now = new Date(); const cm = now.getMonth()+1; const ci = MI[String(cm)]??-1; const n = MN.length
  const rows = data.flatMap(({name,records}) => {
    const seen = new Set<string>()
    return records.filter(r => { const k=r.application_start+"|"+r.exam_date; if(seen.has(k))return false; seen.add(k); return true })
      .map(r => ({name, dept:`${r.faculty_name||""} ${r.department_name||""}`.trim(), ougan:mRange(r.application_start), shiken:mRange(r.exam_date)}))
  })
  return (
    <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", overflow:"hidden"}}>
      <div style={{display:"flex", gap:"14px", padding:"9px 14px", borderBottom:"1px solid var(--border)", background:"var(--surface2)", flexWrap:"wrap"}}>
        {[{c:"linear-gradient(90deg,var(--blue),#818cf8)",l:"出願期間"},{c:"linear-gradient(90deg,var(--amber),#f97316)",l:"試験日程"}].map(x => (
          <span key={x.l} style={{display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"var(--ink2)"}}>
            <span style={{width:"18px", height:"7px", borderRadius:"4px", background:x.c, display:"inline-block"}}/>{x.l}
          </span>
        ))}
        <span style={{fontSize:"11px", color:"#e11d48"}}>｜今月</span>
      </div>
      <div style={{padding:"10px 0 0"}}>
        <div style={{display:"flex", paddingLeft:"120px", marginBottom:"6px"}}>
          {MN.map(m => <div key={m} style={{flex:1,textAlign:"center",fontSize:"9px",fontWeight:700,color:"var(--ink3)"}}>{m}</div>)}
        </div>
        {rows.map((row,i) => (
          <div key={i} style={{display:"flex", alignItems:"center", padding:"4px 0", borderBottom:"1px solid rgba(0,0,0,.03)"}}>
            <div style={{width:"120px", minWidth:"120px", padding:"0 10px", overflow:"hidden"}}>
              <div style={{fontSize:"10px", fontWeight:700, color:"var(--ink)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{row.name}</div>
              <div style={{fontSize:"9px", color:"var(--ink3)"}}>{row.dept.slice(0,14)}</div>
            </div>
            <div style={{flex:1, position:"relative", height:"24px"}}>
              {ci>=0 && <div style={{position:"absolute", top:0, bottom:0, width:"2px", background:"#e11d48", zIndex:5, opacity:.7, left:`${((ci+.5)/n*100).toFixed(1)}%`}}/>}
              {row.ougan && <div style={{position:"absolute", height:"8px", borderRadius:"4px", background:"linear-gradient(90deg,var(--blue),#818cf8)", top:"2px", left:`${(row.ougan.s/n*100).toFixed(1)}%`, width:`${Math.max((row.ougan.e-row.ougan.s+1)/n*100,2).toFixed(1)}%`}}/>}
              {row.shiken && <div style={{position:"absolute", height:"8px", borderRadius:"4px", background:"linear-gradient(90deg,var(--amber),#f97316)", top:"14px", left:`${(row.shiken.s/n*100).toFixed(1)}%`, width:`${Math.max((row.shiken.e-row.shiken.s+1)/n*100,2).toFixed(1)}%`}}/>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CostTab({ data }: { data: UniGroup[] }) {
  let eSum=0, nSum=0
  const rows = data.map(({name,records}) => { const c=parseCost(records[0]?.cost||""); eSum+=c.exam||0; if(c.nyuugaku>0)nSum+=c.nyuugaku; return {name,...c,raw:records[0]?.cost||""} })
  const fy = rows.reduce((s,r)=>s+(r.exam||0)+(r.nyuugaku||0)+(r.jugyou||0),0)
  return (
    <div>
      <div style={{background:"var(--blue-bg)", border:"1.5px solid var(--blue-border)", borderRadius:"12px", padding:"14px 16px", marginBottom:"12px"}}>
        <div style={{fontSize:"13px", fontWeight:700, color:"var(--blue)", marginBottom:"6px"}}>💡 費用シミュレーション</div>
        <div style={{fontSize:"12px", color:"var(--ink2)", lineHeight:1.7}}>データは各大学の募集要項に基づきます。必ず公式サイトでご確認ください。</div>
      </div>
      <table style={{width:"100%", borderCollapse:"collapse", background:"var(--surface)", borderRadius:"14px", overflow:"hidden", border:"1.5px solid var(--border)"}}>
        <thead><tr>{["大学名","受験料","入学金","授業料（年額）","詳細"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:"9px",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--ink3)",background:"var(--surface2)",borderBottom:"1px solid var(--border)"}}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <td style={{padding:"10px 12px",fontWeight:700,color:"var(--ink)",fontSize:"12px"}}>{r.name}</td>
              <td style={{padding:"10px 12px",fontFamily:"DM Mono,monospace",color:"var(--ink)",fontWeight:600}}>{r.exam>0?fmt(r.exam)+"円":"—"}</td>
              <td style={{padding:"10px 12px",fontFamily:"DM Mono,monospace",color:"var(--ink)",fontWeight:600}}>{r.nyuugaku>0?fmt(r.nyuugaku)+"円":"—"}</td>
              <td style={{padding:"10px 12px",fontFamily:"DM Mono,monospace",color:"var(--ink)",fontWeight:600}}>{r.jugyou>0?fmt(r.jugyou)+"円":"—"}</td>
              <td style={{padding:"10px 12px",fontSize:"10px",color:"var(--ink3)",whiteSpace:"pre-line",lineHeight:1.5}}>{String(r.raw).slice(0,60)}</td>
            </tr>
          ))}
          <tr style={{borderTop:"2px solid rgba(13,148,136,.15)"}}>
            <td style={{padding:"10px 12px",fontWeight:700,background:"rgba(13,148,136,.04)"}}>合計</td>
            <td style={{padding:"10px 12px",fontFamily:"DM Mono,monospace",color:"var(--amber)",fontWeight:700,background:"rgba(13,148,136,.04)"}}>{eSum>0?fmt(eSum)+"円":"—"}</td>
            <td style={{padding:"10px 12px",fontFamily:"DM Mono,monospace",fontWeight:700,background:"rgba(13,148,136,.04)"}}>{nSum>0?fmt(nSum)+"円":"—"}</td>
            <td colSpan={2} style={{padding:"10px 12px",fontSize:"10px",color:"var(--ink3)",background:"rgba(13,148,136,.04)"}}>初年度目安: {fy>0?"〜"+fmt(fy)+"円":""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function HeiganTab({ data }: { data: UniGroup[] }) {
  const sOnly = data.filter(u=>u.records.every(r=>r.application_type==="専願"))
  const hOk = data.filter(u=>u.records.some(r=>r.application_type==="併願"))
  const unk = data.filter(u=>!sOnly.includes(u)&&!hOk.includes(u))
  return (
    <div>
      {sOnly.length>0&&<div style={{borderRadius:"12px",padding:"14px 16px",marginBottom:"12px",background:"rgba(225,29,72,.05)",border:"1.5px solid rgba(225,29,72,.15)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#e11d48",marginBottom:"6px"}}>⚠️ 専願のみ — {sOnly.length}校</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{sOnly.map(u=><span key={u.name} style={{padding:"3px 9px",borderRadius:"5px",fontSize:"11px",fontWeight:600,background:"rgba(225,29,72,.08)",color:"#e11d48",border:"1px solid rgba(225,29,72,.18)"}}>🏫 {u.name}</span>)}</div>
      </div>}
      {hOk.length>0&&<div style={{borderRadius:"12px",padding:"14px 16px",marginBottom:"12px",background:"rgba(13,148,136,.05)",border:"1.5px solid rgba(13,148,136,.15)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--teal2)",marginBottom:"6px"}}>✅ 併願可能 — {hOk.length}校</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{hOk.map(u=><span key={u.name} style={{padding:"3px 9px",borderRadius:"5px",fontSize:"11px",fontWeight:600,background:"rgba(13,148,136,.08)",color:"var(--teal2)",border:"1px solid rgba(13,148,136,.18)"}}>🏫 {u.name}</span>)}</div>
      </div>}
      {unk.length>0&&<div style={{borderRadius:"12px",padding:"14px 16px",marginBottom:"12px",background:"var(--amber-bg)",border:"1.5px solid var(--amber-border)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--amber)",marginBottom:"6px"}}>❓ 要確認 — {unk.length}校</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{unk.map(u=><span key={u.name} style={{padding:"3px 9px",borderRadius:"5px",fontSize:"11px",fontWeight:600,background:"var(--surface2)",color:"var(--ink3)"}}>🏫 {u.name}</span>)}</div>
      </div>}
    </div>
  )
}

function ParentTab({ data }: { data: UniGroup[] }) {
  const sOnly = data.filter(u=>u.records.every(r=>r.application_type==="専願"))
  let eSum=0; data.forEach(u=>{const c=parseCost(u.records[0]?.cost||"");eSum+=c.exam||0})
  return (
    <div>
      <div style={{borderRadius:"12px",padding:"14px 16px",marginBottom:"12px",background:"var(--blue-bg)",border:"1.5px solid var(--blue-border)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--blue)",marginBottom:"6px"}}>👨‍👩‍👧 保護者の方へ</div>
        <div style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.7}}>総合型選抜は出願時期・選考内容が大学によって大きく異なります。早めの情報収集と、お子さんとの定期的な確認が合格への鍵です。</div>
      </div>
      {sOnly.length>0&&<div style={{borderRadius:"12px",padding:"14px 16px",marginBottom:"12px",background:"rgba(225,29,72,.05)",border:"1.5px solid rgba(225,29,72,.15)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#e11d48",marginBottom:"6px"}}>⚠️ 専願のみ（{sOnly.length}校） — 重要</div>
        <div style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.7}}>{sOnly.map(u=>u.name).join("、")}は専願です。合格後に辞退すると高校の推薦枠に影響する可能性があります。</div>
      </div>}
      {eSum>0&&<div style={{borderRadius:"12px",padding:"14px 16px",marginBottom:"12px",background:"var(--blue-bg)",border:"1.5px solid var(--blue-border)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--blue)",marginBottom:"6px"}}>💰 受験料目安: {fmt(eSum)}円（{data.length}校分）</div>
        <div style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.7}}>交通費・宿泊費・書類郵送費・参考書代は含まれていません。余裕を持った資金計画を。</div>
      </div>}
    </div>
  )
}