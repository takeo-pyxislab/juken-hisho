"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

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

type MyTarget = { id: string; university_name: string; faculty_name: string | null; department: string | null; priority: number }

type Purpose = "cost" | "timeline" | "heigan" | "search"

const PURPOSE_CONFIG = {
  cost:     { icon: "💰", title: "受験にいくらかかる？", desc: "受験料・入学金・授業料を大学ごとに比較", sample: "例: 3校で合計 約12万円" },
  timeline: { icon: "📅", title: "日程を整理する", desc: "出願期間・試験日・結果発表を一覧で確認", sample: "例: 最短の締切は9月1日" },
  heigan:   { icon: "⚡", title: "併願できるか確認", desc: "専願/併願の区分をチェック", sample: "例: 3校中2校が併願OK" },
  search:   { icon: "🔍", title: "まず大学を探す", desc: "8,015学科から条件で絞り込み", sample: "" },
}

export default function SimulatorPage() {
  // Step state
  const [purpose, setPurpose] = useState<Purpose | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  // はじめての方フラグ（Step2の空状態メッセージを変える）
  const [isFirstTimer, setIsFirstTimer] = useState(false)

  // Search (name)
  const [uniNames, setUniNames] = useState<UniName[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  // Filter (separate)
  const [filterNames, setFilterNames] = useState<UniName[]>([])
  const [filterLoading, setFilterLoading] = useState(false)
  const [region, setRegion] = useState("")
  const [prefs, setPrefs] = useState<Set<string>>(new Set())
  const [facCategory, setFacCategory] = useState("")
  const [ougan, setOugan] = useState("")
  const [kyotsuu, setKyotsuu] = useState("")
  const [searchMode, setSearchMode] = useState<"name" | "filter">("name")

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [uniDepts, setUniDepts] = useState<Record<string, URecord[]>>({})
  const [deptFilter, setDeptFilter] = useState<Map<string, Set<string>>>(new Map())
  const [expandedUnis, setExpandedUnis] = useState<Set<string>>(new Set())
  const [deptLoadingSet, setDeptLoadingSet] = useState<Set<string>>(new Set())

  // Simulation
  const [simData, setSimData] = useState<UniGroup[]>([])
  const [simLoading, setSimLoading] = useState(false)
  const [rightTab, setRightTab] = useState<string>("detail")
  const [filterDeptMode, setFilterDeptMode] = useState(false)
  const [hiddenDepts, setHiddenDepts] = useState<Set<string>>(new Set())

  // Auth
  const [userId, setUserId] = useState<string | null>(null)
  const [myTargets, setMyTargets] = useState<MyTarget[]>([])
  const [savingUni, setSavingUni] = useState<string | null>(null)
  const [showSignupModal, setShowSignupModal] = useState(false)

  const supabase = createClient()
  const step2Ref = useRef<HTMLDivElement>(null)
  const step3Ref = useRef<HTMLDivElement>(null)

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setAuthLoaded(true); return }
      setUserId(user.id)
      supabase.from("target_universities").select("*").eq("user_id", user.id).order("priority")
        .then(({ data }) => {
          const targets = data || []
          setMyTargets(targets)
          if (targets.length > 0) {
            setSelected(new Set(targets.map((t: MyTarget) => t.university_name)))
            const deptFilterMap = new Map<string, Set<string>>()
            targets.forEach((t: MyTarget) => {
              if (t.faculty_name && t.department) {
                if (!deptFilterMap.has(t.university_name)) deptFilterMap.set(t.university_name, new Set())
                deptFilterMap.get(t.university_name)!.add(`${t.faculty_name}||${t.department}`)
              }
            })
            if (deptFilterMap.size > 0) setDeptFilter(deptFilterMap)
            const uNames = [...new Set(targets.map((t: MyTarget) => t.university_name))]
            uNames.forEach(async (name) => {
              try {
                const res = await fetch(`/api/universities?keyword=${encodeURIComponent(name)}&limit=50`)
                const d = await res.json()
                const records = (d.data || []).filter((r: URecord) => r.university_name === name)
                setUniDepts(prev => ({ ...prev, [name]: records }))
              } catch {}
            })
          }
          setAuthLoaded(true)
        })
    })
  }, [])

  // Name search (separate)
  useEffect(() => {
    if (!keyword) { setLoading(false); setUniNames([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      const params = new URLSearchParams()
      params.set("keyword", keyword)
      try {
        const res = await fetch(`/api/university-names?${params}`)
        const data = await res.json()
        setUniNames(data.empty ? [] : (data.data || []))
      } catch { setUniNames([]) }
      setLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [keyword])

  // Filter search (separate)
  const prefsKey = [...prefs].sort().join(",")
  useEffect(() => {
    const hasFilter = prefs.size > 0 || facCategory || ougan || kyotsuu
    if (!hasFilter) { setFilterLoading(false); setFilterNames([]); return }
    setFilterLoading(true)
    const t = setTimeout(async () => {
      const params = new URLSearchParams()
      if (prefs.size > 0) params.set("prefecture", [...prefs].join(","))
      if (facCategory) params.set("category", facCategory)
      if (ougan) params.set("app_type", ougan)
      if (kyotsuu) params.set("kyotsuu", kyotsuu)
      try {
        const res = await fetch(`/api/university-names?${params}`)
        const data = await res.json()
        setFilterNames(data.empty ? [] : (data.data || []))
      } catch { setFilterNames([]) }
      setFilterLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [prefsKey, facCategory, ougan, kyotsuu])

  const toggleExpand = async (uniName: string) => {
    const next = new Set(expandedUnis)
    if (next.has(uniName)) { next.delete(uniName); setExpandedUnis(next); return }
    next.add(uniName)
    setExpandedUnis(next)
    if (!uniDepts[uniName]) {
      setDeptLoadingSet(prev => new Set([...prev, uniName]))
      try {
        const res = await fetch(`/api/universities?keyword=${encodeURIComponent(uniName)}&limit=50`)
        const data = await res.json()
        const records = (data.data || []).filter((r: URecord) => r.university_name === uniName)
        setUniDepts(prev => ({ ...prev, [uniName]: records }))
      } catch {}
      setDeptLoadingSet(prev => { const s = new Set(prev); s.delete(uniName); return s })
    }
  }

  const toggleUni = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(name)) { next.delete(name); setDeptFilter(f => { const m = new Map(f); m.delete(name); return m }) }
      else next.add(name)
      return next
    })
  }

  const toggleDept = (uniName: string, faculty: string, dept: string) => {
    const records = uniDepts[uniName] || []
    const allKeys = records.map(r => `${r.faculty_name}||${r.department_name}`)
    const deptKey = `${faculty}||${dept}`
    setDeptFilter(prev => {
      const next = new Map(prev)
      let current = next.get(uniName)
      if (!current) { current = new Set(allKeys); current.delete(deptKey) }
      else { current = new Set(current); if (current.has(deptKey)) current.delete(deptKey); else current.add(deptKey) }
      if (current.size === 0) { setSelected(s => { const n = new Set(s); n.delete(uniName); return n }); next.delete(uniName) }
      else if (current.size === allKeys.length) next.delete(uniName)
      else next.set(uniName, current)
      return next
    })
    setSelected(prev => prev.has(uniName) ? prev : new Set([...prev, uniName]))
  }

  const toggleFaculty = (uniName: string, faculty: string, deptNames: string[]) => {
    const records = uniDepts[uniName] || []
    const allKeys = records.map(r => `${r.faculty_name}||${r.department_name}`)
    const facKeys = deptNames.map(d => `${faculty}||${d}`)
    setDeptFilter(prev => {
      const next = new Map(prev)
      let current = next.get(uniName)
      if (!current) current = new Set(allKeys); else current = new Set(current)
      const allFacSelected = facKeys.every(k => current!.has(k))
      if (allFacSelected) facKeys.forEach(k => current!.delete(k)); else facKeys.forEach(k => current!.add(k))
      if (current.size === 0) { setSelected(s => { const n = new Set(s); n.delete(uniName); return n }); next.delete(uniName) }
      else if (current.size === allKeys.length) next.delete(uniName)
      else next.set(uniName, current)
      return next
    })
    setSelected(prev => prev.has(uniName) ? prev : new Set([...prev, uniName]))
  }

  const saveToTargets = async (uniName: string, facultyName: string, deptName: string) => {
    if (!userId) { setShowSignupModal(true); return }
    const saveKey = `${uniName}||${facultyName}||${deptName}`
    setSavingUni(saveKey)
    const alreadySaved = myTargets.some(t => t.university_name === uniName && t.faculty_name === facultyName && t.department === deptName)
    if (alreadySaved) {
      const target = myTargets.find(t => t.university_name === uniName && t.faculty_name === facultyName && t.department === deptName)!
      await supabase.from("target_universities").delete().eq("id", target.id)
      setMyTargets(prev => prev.filter(t => t.id !== target.id))
    } else {
      const { data } = await supabase.from("target_universities").insert({
        user_id: userId, university_name: uniName, faculty_name: facultyName, department: deptName, priority: myTargets.length + 1,
      }).select().single()
      if (data) setMyTargets(prev => [...prev, data])
    }
    setSavingUni(null)
  }

  // Logged-in users with saved targets: auto-advance to Step 2
  const [authLoaded, setAuthLoaded] = useState(false)
  useEffect(() => {
    if (authLoaded && userId && myTargets.length > 0 && !purpose) {
      setPurpose("search")
      setStep(2)
      setRightTab("detail")
    }
  }, [authLoaded, userId, myTargets.length])

  const selectPurpose = (p: Purpose) => {
    setPurpose(p)
    setStep(2)
    if (p === "cost") setRightTab("cost")
    else if (p === "timeline") setRightTab("timeline")
    else if (p === "heigan") setRightTab("heigan")
    else setRightTab("detail")
    // 改善5: 目的に応じてデフォルトの検索モードを切替
    setSearchMode(p === "search" ? "filter" : "name")
    setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
  }

  const runSimulation = async () => {
    if (selected.size === 0) return
    setSimLoading(true)
    setStep(3)
    setFilterDeptMode(false)
    setHiddenDepts(new Set())
    const names = [...selected]
    const results: UniGroup[] = []
    for (const name of names) {
      const res = await fetch(`/api/universities?keyword=${encodeURIComponent(name)}&limit=50`)
      const data = await res.json()
      let records = (data.data || []).filter((r: URecord) => r.university_name === name)
      const filter = deptFilter.get(name)
      if (filter && filter.size > 0) records = records.filter((r: URecord) => filter.has(`${r.faculty_name}||${r.department_name}`))
      results.push({ name, records })
    }
    setSimData(results)
    setSimLoading(false)
    setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200)
  }

  const purposeLabel = purpose ? PURPOSE_CONFIG[purpose].title : ""

  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
      {/* ナビ */}
      <nav style={{
        position:"sticky", top:0, zIndex:300, height:"58px", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(250,250,250,.94)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:"9px", textDecoration:"none"}}>
          <img src="/logo.png" alt="ユニパス" style={{height:"44px", objectFit:"contain"}} />
          <div>
          </div>
        </Link>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          {userId ? (
            <>
              <Link href="/mypage" style={{padding:"6px 12px", borderRadius:"10px", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none", border:"1px solid var(--border)"}}>マイページ</Link>
              <Link href="/questionnaire" style={{padding:"7px 16px", borderRadius:"10px", background:"var(--teal)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>AI診断</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{padding:"6px 12px", borderRadius:"10px", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none"}}>ログイン</Link>
              <Link href="/signup" style={{padding:"7px 16px", borderRadius:"10px", background:"linear-gradient(135deg,var(--coral),var(--coral2))", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>プレミアム登録</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{maxWidth:"1100px", margin:"0 auto", padding:"0 20px"}}>

        {/* ━━━ STEP 1: 目的を選ぶ ━━━ */}
        <div style={{padding:"48px 0 32px", textAlign:"center"}}>
          <div style={{fontSize:"11px", fontWeight:700, color:"var(--coral)", letterSpacing:".15em", marginBottom:"10px"}}>STEP 1</div>
          <h1 style={{fontFamily:"Zen Maru Gothic,sans-serif", fontSize:"26px", fontWeight:800, color:"var(--ink)", marginBottom:"8px"}}>
            何を整理したいですか？
          </h1>
          <p style={{fontSize:"14px", color:"var(--ink3)", marginBottom:"24px"}}>知りたいことを選ぶと、大学選択に進みます</p>

          <div className="purpose-grid" style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"14px", maxWidth:"800px", margin:"0 auto", marginBottom:"24px"}}>
            {(["cost","timeline","heigan","search"] as Purpose[]).map(p => {
              const c = PURPOSE_CONFIG[p]
              const isSelected = purpose === p
              return (
                <button key={p} onClick={() => selectPurpose(p)} className="purpose-card" style={{
                  padding:"28px 16px", borderRadius:"20px", cursor:"pointer", fontFamily:"inherit",
                  border: isSelected ? "2px solid var(--coral)" : "1.5px solid var(--border)",
                  background: isSelected ? "var(--coral-bg)" : "var(--surface)",
                  boxShadow: isSelected ? "0 4px 20px rgba(249,112,102,.18)" : "var(--sh-sm)",
                  transition:"all .2s ease", textAlign:"center",
                  transform: isSelected ? "translateY(-3px)" : "none",
                }}>
                  <div style={{fontSize:"48px", marginBottom:"14px", lineHeight:1}}>{c.icon}</div>
                  <div style={{fontSize:"14px", fontWeight:700, color: isSelected ? "var(--coral)" : "var(--ink)", marginBottom:"6px"}}>{c.title}</div>
                  <div style={{fontSize:"11px", color:"var(--ink3)", lineHeight:1.6, marginBottom: c.sample ? "8px" : "0"}}>{c.desc}</div>
                  {c.sample && <div style={{fontSize:"10px", color:"var(--coral)", fontWeight:600, background:"var(--coral-bg)", borderRadius:"20px", padding:"3px 10px", display:"inline-block"}}>{c.sample}</div>}
                </button>
              )
            })}
          </div>

          {/* はじめての方 + 指定校リンク */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"10px"}}>
            <button onClick={() => {
              setIsFirstTimer(true)
              setSelected(new Set(["中央大学", "亜細亜大学"]))
              selectPurpose("search")
              setSearchMode("name")
            }} style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"12px 28px", borderRadius:"14px",
              background:"linear-gradient(135deg,var(--teal),#06b6d4)", color:"#fff",
              fontSize:"14px", fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit",
              boxShadow:"0 4px 16px rgba(13,148,136,.25)"
            }}>
              🎓 はじめての方はこちら — サンプル2校で体験してみる
            </button>
            <Link href="/guide/shiteiko-vs-sougata" style={{display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"var(--teal)", fontWeight:600, textDecoration:"none", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"5px 14px"}}>
              📖 指定校推薦と迷っている方はこちら →
            </Link>
          </div>
        </div>

        {/* ━━━ STEP 2: 大学を選ぶ ━━━ */}
        {purpose && (
          <div ref={step2Ref} style={{paddingBottom:"32px"}}>
            <div style={{borderTop:"1px solid var(--border)", paddingTop:"32px", marginBottom:"24px"}}>
              <div style={{display:"flex", alignItems:"center", gap:"12px", marginBottom:"6px"}}>
                <div style={{fontSize:"11px", fontWeight:700, color:"var(--coral)", letterSpacing:".15em"}}>STEP 2</div>
                <div style={{fontSize:"10px", color:"var(--ink3)", background:"var(--surface2)", borderRadius:"20px", padding:"2px 10px"}}>
                  {PURPOSE_CONFIG[purpose].icon} {purposeLabel}
                </div>
              </div>
              <h2 style={{fontFamily:"Zen Maru Gothic,sans-serif", fontSize:"22px", fontWeight:800, color:"var(--ink)", marginBottom:"6px"}}>比較したい大学を選んでください</h2>
              <p style={{fontSize:"13px", color:"var(--ink3)"}}>検索して大学を追加。▼ で学科単位の絞り込みもできます。</p>
            </div>

            <div className="step2-layout" style={{display:"flex", gap:"20px", alignItems:"flex-start"}}>
              {/* 左: 検索 / 絞り込み + 結果 */}
              <div style={{flex:1, minWidth:0}}>
                {/* タブ切替: 名前検索 / 条件で絞り込み */}
                <div style={{display:"flex", gap:"3px", background:"var(--surface2)", borderRadius:"14px", padding:"4px", marginBottom:"14px"}}>
                  <button onClick={() => setSearchMode("name")} style={{
                    flex:1, padding:"10px", borderRadius:"12px", border:"none", fontFamily:"inherit",
                    background: searchMode === "name" ? "var(--surface)" : "transparent",
                    color: searchMode === "name" ? "var(--coral)" : "var(--ink3)",
                    fontSize:"13px", fontWeight:700, cursor:"pointer",
                    boxShadow: searchMode === "name" ? "var(--sh-sm)" : "none"
                  }}>🔍 大学名で検索</button>
                  <button onClick={() => setSearchMode("filter")} style={{
                    flex:1, padding:"10px", borderRadius:"12px", border:"none", fontFamily:"inherit",
                    background: searchMode === "filter" ? "var(--surface)" : "transparent",
                    color: searchMode === "filter" ? "var(--coral)" : "var(--ink3)",
                    fontSize:"13px", fontWeight:700, cursor:"pointer",
                    boxShadow: searchMode === "filter" ? "var(--sh-sm)" : "none"
                  }}>⚙ 条件で絞り込み</button>
                </div>

                {/* 名前検索 */}
                {searchMode === "name" && (
                  <div style={{marginBottom:"14px"}}>
                    <input value={keyword} onChange={e => setKeyword(e.target.value)}
                      placeholder="大学名・学部名を入力..."
                      style={{width:"100%", padding:"13px 18px", border:"1.5px solid var(--border)", borderRadius:"16px", background:"var(--surface)", color:"var(--ink)", fontSize:"14px", fontFamily:"inherit", outline:"none", boxSizing:"border-box", boxShadow:"var(--sh-sm)"}} />
                  </div>
                )}

                {/* 条件絞り込み */}
                {searchMode === "filter" && (
                  <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"16px", padding:"18px", marginBottom:"14px", display:"flex", flexDirection:"column", gap:"12px"}}>
                    <div>
                      <div style={{fontSize:"10px", fontWeight:700, color:"var(--ink3)", marginBottom:"4px"}}>地域</div>
                      <select value={region} onChange={e => { setRegion(e.target.value); setPrefs(new Set()) }}
                        style={{width:"100%", maxWidth:"240px", padding:"8px 10px", border:"1.5px solid var(--border)", borderRadius:"10px", background:"var(--surface2)", color:"var(--ink)", fontSize:"12px", fontFamily:"inherit"}}>
                        <option value="">すべての地域</option>
                        {Object.keys(PREFS).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{fontSize:"10px", fontWeight:700, color:"var(--ink3)", marginBottom:"4px"}}>
                        都道府県{prefs.size > 0 && <span style={{color:"var(--coral)", marginLeft:"4px"}}>({prefs.size}件選択中)</span>}
                      </div>
                      <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
                        {(region ? PREFS[region] || [] : Object.values(PREFS).flat()).map(p => {
                          const isOn = prefs.has(p)
                          return (
                            <button key={p} onClick={() => setPrefs(prev => {
                              const next = new Set(prev)
                              if (next.has(p)) next.delete(p); else next.add(p)
                              return next
                            })} style={{
                              padding:"4px 10px", borderRadius:"20px", fontFamily:"inherit",
                              border:`1.5px solid ${isOn ? "var(--teal)" : "var(--border)"}`,
                              background: isOn ? "rgba(13,148,136,.08)" : "transparent",
                              color: isOn ? "var(--teal)" : "var(--ink3)",
                              fontSize:"11px", cursor:"pointer", fontWeight: isOn ? 700 : 500
                            }}>{p}</button>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:"10px", fontWeight:700, color:"var(--ink3)", marginBottom:"4px"}}>学部系統</div>
                      <div style={{display:"flex", flexWrap:"wrap", gap:"5px"}}>
                        {[{v:"",l:"すべて"},{v:"文系・国際",l:"文系"},{v:"理工・情報",l:"理系"},{v:"医療・保健",l:"医療"},{v:"教育",l:"教育"},{v:"芸術・スポーツ",l:"芸術"},{v:"農・食・環境",l:"農食"}].map(c => (
                          <button key={c.v} onClick={() => setFacCategory(c.v)} style={{
                            padding:"5px 12px", borderRadius:"20px", fontFamily:"inherit",
                            border:`1.5px solid ${facCategory===c.v?"var(--coral)":"var(--border)"}`,
                            background: facCategory===c.v?"var(--coral-bg)":"transparent",
                            color: facCategory===c.v?"var(--coral)":"var(--ink3)",
                            fontSize:"11px", cursor:"pointer", fontWeight:600
                          }}>{c.l}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
                      <div>
                        <div style={{fontSize:"10px", fontWeight:700, color:"var(--ink3)", marginBottom:"4px"}}>出願区分</div>
                        <div style={{display:"flex", gap:"4px"}}>
                          {[{v:"",l:"すべて"},{v:"専願",l:"専願のみ"},{v:"併願",l:"併願可"}].map(c => (
                            <button key={c.v} onClick={() => setOugan(c.v)} style={{
                              padding:"5px 12px", borderRadius:"20px", fontFamily:"inherit",
                              border:`1.5px solid ${ougan===c.v?"var(--coral)":"var(--border)"}`,
                              background: ougan===c.v?"var(--coral-bg)":"transparent",
                              color: ougan===c.v?"var(--coral)":"var(--ink3)",
                              fontSize:"11px", cursor:"pointer", fontWeight:600
                            }}>{c.l}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:"10px", fontWeight:700, color:"var(--ink3)", marginBottom:"4px"}}>共通テスト</div>
                        <div style={{display:"flex", gap:"4px"}}>
                          {[{v:"",l:"すべて"},{v:"あり",l:"あり"},{v:"なし",l:"なし"}].map(c => (
                            <button key={c.v} onClick={() => setKyotsuu(c.v)} style={{
                              padding:"5px 12px", borderRadius:"20px", fontFamily:"inherit",
                              border:`1.5px solid ${kyotsuu===c.v?"var(--coral)":"var(--border)"}`,
                              background: kyotsuu===c.v?"var(--coral-bg)":"transparent",
                              color: kyotsuu===c.v?"var(--coral)":"var(--ink3)",
                              fontSize:"11px", cursor:"pointer", fontWeight:600
                            }}>{c.l}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {(prefs.size > 0 || facCategory || ougan || kyotsuu) && (
                      <button onClick={() => { setRegion(""); setPrefs(new Set()); setFacCategory(""); setOugan(""); setKyotsuu("") }} style={{
                        alignSelf:"flex-start", padding:"6px 14px", borderRadius:"10px", border:"none",
                        background:"var(--surface2)", color:"var(--ink3)", fontSize:"11px", cursor:"pointer", fontFamily:"inherit"
                      }}>✕ 条件をクリア</button>
                    )}
                  </div>
                )}

                {/* 検索結果リスト - card based */}
                {(() => {
                  const displayNames = searchMode === "name" ? uniNames : filterNames
                  const isLoading = searchMode === "name" ? loading : filterLoading
                  const hasInput = searchMode === "name" ? !!keyword : !!(prefs.size > 0 || facCategory || ougan || kyotsuu)
                  return (
                <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                  {isLoading ? (
                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"120px", gap:"8px", background:"var(--surface)", borderRadius:"16px", border:"1.5px solid var(--border)"}}>
                      <div style={{width:"20px", height:"20px", border:"3px solid var(--border)", borderTopColor:"var(--coral)", borderRadius:"50%", animation:"spin .7s linear infinite"}}/>
                      <span style={{fontSize:"12px", color:"var(--ink3)"}}>検索中...</span>
                    </div>
                  ) : !hasInput || displayNames.length === 0 ? (
                    <div style={{padding:"44px 20px", textAlign:"center", background:"var(--surface)", borderRadius:"20px", border:"1.5px dashed var(--border)"}}>
                      {isFirstTimer && !hasInput ? (
                        <>
                          <div style={{fontSize:"40px", marginBottom:"12px"}}>🎓</div>
                          <div style={{fontSize:"15px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>
                            サンプル2校を用意しました！
                          </div>
                          <div style={{fontSize:"12px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"12px"}}>
                            右の「シミュレーション開始」を押して、<br/>
                            費用・日程・併願の比較を体験してみましょう。
                          </div>
                          <div style={{fontSize:"12px", color:"var(--ink3)", lineHeight:1.8}}>
                            自分の気になる大学に入れ替えたい場合は、<br/>
                            上の検索バーから追加・削除できます。
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{fontSize:"40px", marginBottom:"12px", opacity:.4}}>{searchMode === "name" ? "🔍" : "⚙"}</div>
                          <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px"}}>
                            {searchMode === "name" ? "大学名で検索してください" : hasInput ? "該当する大学がありません" : "条件を選択してください"}
                          </div>
                          <div style={{fontSize:"11px", color:"var(--ink3)", lineHeight:1.8}}>
                            {searchMode === "name" ? "例：「早稲田」「看護」「東京」「国際」" : "地域・学部系統・出願区分で絞り込めます"}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    displayNames.map(u => {
                      const sel = selected.has(u.name)
                      const isExpanded = expandedUnis.has(u.name)
                      const isLoadingDept = deptLoadingSet.has(u.name)
                      const currentFilter = deptFilter.get(u.name)
                      const depts = uniDepts[u.name] || []
                      const totalDepts = depts.length
                      const selectedDeptCount = currentFilter ? currentFilter.size : totalDepts
                      const isPartial = currentFilter && currentFilter.size > 0 && currentFilter.size < totalDepts
                      const tagColor = (!u.hasHeigan && u.hasSengan) ? {bg:"rgba(239,68,68,.1)", color:"#e11d48"} : u.hasHeigan ? {bg:"rgba(13,148,136,.1)", color:"var(--teal2)"} : {bg:"var(--surface2)", color:"var(--ink3)"}
                      const tagLabel = (!u.hasHeigan && u.hasSengan) ? "専願" : u.hasHeigan ? "併願可" : "要確認"

                      return (
                        <div key={u.name} className="uni-card" style={{
                          background:"var(--surface)", borderRadius:"16px",
                          border: sel ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                          boxShadow:"var(--sh-sm)",
                        }}>
                          <div style={{padding:"12px 14px"}}>
                            {/* 1行目: 大学名 */}
                            <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>{u.name}</div>
                            {/* 2行目: タグ + ボタン */}
                            <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
                              <span style={{padding:"2px 7px", borderRadius:"6px", fontSize:"9px", fontWeight:700, background:tagColor.bg, color:tagColor.color}}>{tagLabel}</span>
                              {u.cats.slice(0,1).map(c => <span key={c} style={{padding:"2px 7px", borderRadius:"6px", fontSize:"9px", fontWeight:700, background:"var(--surface2)", color:"var(--ink3)"}}>{c}</span>)}
                              {isPartial && <span style={{fontSize:"9px", color:"var(--amber)", fontWeight:700}}>{selectedDeptCount}学科</span>}
                              <span style={{flex:1}} />
                              <button onClick={() => toggleUni(u.name)} style={{
                                padding:"4px 10px", borderRadius:"8px", cursor:"pointer", fontFamily:"inherit",
                                fontSize:"11px", fontWeight:700, border:"none",
                                background: sel ? "var(--teal)" : "var(--coral)",
                                color: "#fff",
                              }}>
                                {sel ? "✓ 済" : "+ 追加"}
                              </button>
                              <button onClick={() => toggleExpand(u.name)} style={{
                                background:"var(--surface2)", border:"none", cursor:"pointer", padding:"4px 7px",
                                color:"var(--ink3)", fontSize:"10px", fontFamily:"inherit",
                                borderRadius:"6px"
                              }}>{isExpanded ? "▲" : "▼"}</button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div style={{borderTop:"1px solid var(--border)", background:"var(--surface2)"}}>
                              {isLoadingDept ? (
                                <div style={{padding:"14px", display:"flex", alignItems:"center", gap:"8px"}}>
                                  <div style={{width:"14px", height:"14px", border:"2px solid var(--border)", borderTopColor:"var(--coral)", borderRadius:"50%", animation:"spin .7s linear infinite"}}/>
                                  <span style={{fontSize:"11px", color:"var(--ink3)"}}>学科を読み込み中...</span>
                                </div>
                              ) : depts.length === 0 ? (
                                <div style={{padding:"14px 16px", fontSize:"11px", color:"var(--ink3)"}}>学科データがありません</div>
                              ) : (
                                <div style={{padding:"8px"}}>
                                {Object.entries(depts.reduce((acc, r) => {
                                  if (!acc[r.faculty_name]) acc[r.faculty_name] = []
                                  if (!acc[r.faculty_name].includes(r.department_name)) acc[r.faculty_name].push(r.department_name)
                                  return acc
                                }, {} as Record<string, string[]>)).map(([faculty, deptNames], fi) => {
                                  const facKeys = deptNames.map(d => `${faculty}||${d}`)
                                  const allFacSelected = !currentFilter || facKeys.every(k => currentFilter.has(k))
                                  const someFacSelected = !currentFilter || facKeys.some(k => currentFilter.has(k))
                                  return (
                                    <div key={faculty} style={{marginBottom: fi < Object.keys(depts.reduce((acc, r) => { acc[r.faculty_name]=1; return acc }, {} as Record<string, number>)).length - 1 ? "6px" : 0}}>
                                      <div onClick={() => toggleFaculty(u.name, faculty, deptNames)} style={{
                                        display:"flex", alignItems:"center", gap:"8px", padding:"8px 12px",
                                        cursor:"pointer", borderRadius:"10px", background:"rgba(255,255,255,.6)",
                                        marginBottom:"4px"
                                      }}>
                                        <div style={{
                                          width:"18px", height:"18px", minWidth:"18px", borderRadius:"6px",
                                          border:`1.5px solid ${allFacSelected?"var(--teal)":someFacSelected?"var(--amber)":"var(--border)"}`,
                                          background: allFacSelected?"var(--teal)":someFacSelected?"rgba(245,158,11,.15)":"transparent",
                                          display:"flex", alignItems:"center", justifyContent:"center",
                                          fontSize:"9px", color: someFacSelected&&!allFacSelected?"var(--amber)":"#fff", flexShrink:0
                                        }}>{allFacSelected?"✓":someFacSelected?"—":""}</div>
                                        <div style={{flex:1, fontSize:"12px", fontWeight:700, color:"var(--ink2)"}}>{faculty}</div>
                                        <div style={{fontSize:"9px", color:"var(--ink3)", background:"var(--surface2)", borderRadius:"8px", padding:"2px 7px"}}>{deptNames.length}学科</div>
                                      </div>
                                      {deptNames.map(dept => {
                                        const deptKey = `${faculty}||${dept}`
                                        const isDeptSel = !currentFilter || currentFilter.has(deptKey)
                                        return (
                                          <div key={dept} onClick={() => toggleDept(u.name, faculty, dept)} style={{
                                            display:"flex", alignItems:"center", gap:"8px",
                                            padding:"6px 12px 6px 36px", cursor:"pointer",
                                            borderRadius:"8px", marginBottom:"2px",
                                            background: isDeptSel ? "rgba(13,148,136,.04)" : "transparent",
                                            transition:".1s"
                                          }}>
                                            <div style={{
                                              width:"15px", height:"15px", minWidth:"15px", borderRadius:"5px",
                                              border:`1.5px solid ${isDeptSel?"var(--teal)":"var(--border)"}`,
                                              background: isDeptSel?"var(--teal)":"transparent",
                                              display:"flex", alignItems:"center", justifyContent:"center",
                                              fontSize:"8px", color:"#fff", flexShrink:0
                                            }}>{isDeptSel?"✓":""}</div>
                                            <div style={{fontSize:"11px", color:"var(--ink2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{dept}</div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )
                                })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
                  )
                })()}
              </div>

              {/* 右: 選択中の大学 + シミュレーション開始 */}
              <div className="step2-right" style={{width:"340px", minWidth:"340px", position:"sticky", top:"80px"}}>
                <div style={{
                  background:"var(--surface)",
                  borderRadius:"20px", overflow:"hidden",
                  border:"1.5px solid var(--border)",
                  boxShadow:"0 4px 20px rgba(0,0,0,.06)"
                }}>
                  {/* Coral accent top bar */}
                  <div style={{height:"4px", background:"linear-gradient(90deg,var(--coral),#fb923c)"}} />
                  <div style={{padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <h3 style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", margin:0}}>選択中の大学</h3>
                    <div style={{
                      background:"var(--coral-bg)", borderRadius:"20px", padding:"4px 14px",
                      display:"flex", alignItems:"baseline", gap:"2px"
                    }}>
                      <span style={{fontSize:"22px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"var(--coral)"}}>{selected.size}</span>
                      <span style={{fontSize:"11px", color:"var(--ink3)", fontWeight:600}}>校</span>
                    </div>
                  </div>

                  <div style={{padding:"12px 16px", maxHeight:"280px", overflowY:"auto"}}>
                    {selected.size === 0 ? (
                      <div style={{padding:"28px 0", textAlign:"center"}}>
                        <div style={{fontSize:"36px", marginBottom:"10px", opacity:.4}}>👈</div>
                        <div style={{fontSize:"13px", color:"var(--ink3)", lineHeight:1.7, fontWeight:600}}>
                          大学を追加してみよう！
                        </div>
                        <div style={{fontSize:"11px", color:"var(--ink4)", marginTop:"4px"}}>左のリストから「+ 追加」ボタンを押してね</div>
                      </div>
                    ) : (
                      <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
                        {[...selected].map(name => {
                          const filter = deptFilter.get(name)
                          const depts = uniDepts[name] || []
                          const count = filter ? filter.size : (depts.length || 1)
                          return (
                            <div key={name} style={{
                              display:"inline-flex", alignItems:"center", gap:"6px", padding:"7px 12px",
                              background:"var(--coral-bg)", borderRadius:"12px", border:"1px solid var(--coral-border)",
                              maxWidth:"100%"
                            }}>
                              <div style={{fontSize:"12px", fontWeight:600, color:"var(--coral)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                                {name}
                                {depts.length > 0 && <span style={{fontSize:"10px", color:"var(--coral2)", marginLeft:"4px", opacity:.7}}>{count}学科</span>}
                              </div>
                              <button onClick={() => toggleUni(name)} style={{
                                background:"transparent", border:"none", fontSize:"13px", color:"var(--coral2)",
                                cursor:"pointer", padding:"0 2px", lineHeight:1, flexShrink:0, opacity:.7
                              }}>✕</button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div style={{padding:"16px 20px", borderTop:"1px solid var(--border)"}}>
                    <button onClick={runSimulation} disabled={selected.size === 0 || simLoading} style={{
                      width:"100%", padding:"15px", borderRadius:"14px", border:"none",
                      background: selected.size > 0 ? "linear-gradient(135deg,var(--coral),var(--coral2))" : "var(--surface2)",
                      color: selected.size > 0 ? "#fff" : "var(--ink4)",
                      fontSize:"14px", fontWeight:800, cursor: selected.size > 0 ? "pointer" : "not-allowed",
                      fontFamily:"inherit", transition:".2s",
                      boxShadow: selected.size > 0 ? "0 4px 20px rgba(249,112,102,.3)" : "none"
                    }}>
                      {simLoading ? "シミュレーション中..." : `${PURPOSE_CONFIG[purpose!].icon} ${purposeLabel}シミュレーション開始`}
                    </button>
                    {selected.size > 0 && (
                      <button onClick={() => { setSelected(new Set()); setDeptFilter(new Map()); setExpandedUnis(new Set()) }} style={{
                        width:"100%", padding:"8px", marginTop:"8px", background:"transparent",
                        border:"none", color:"var(--ink4)", fontSize:"11px", cursor:"pointer", fontFamily:"inherit"
                      }}>選択をクリア</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ STEP 3: 結果 ━━━ */}
        {step === 3 && (
          <div ref={step3Ref} style={{paddingBottom:"40px"}}>
            <div style={{borderTop:"1px solid var(--border)", paddingTop:"32px", marginBottom:"20px"}}>
              <div style={{display:"flex", alignItems:"center", gap:"12px", marginBottom:"6px"}}>
                <div style={{fontSize:"11px", fontWeight:700, color:"var(--coral)", letterSpacing:".15em"}}>STEP 3</div>
              </div>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px"}}>
                <h2 style={{fontFamily:"Zen Maru Gothic,sans-serif", fontSize:"22px", fontWeight:800, color:"var(--ink)", margin:0}}>
                  {PURPOSE_CONFIG[purpose!].icon} シミュレーション結果
                </h2>
                <button onClick={() => { setStep(2); setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: "smooth" }), 100) }} style={{
                  padding:"7px 16px", borderRadius:"10px", border:"1.5px solid var(--border)",
                  background:"var(--surface)", color:"var(--ink2)", fontSize:"12px", fontWeight:600,
                  cursor:"pointer", fontFamily:"inherit"
                }}>← 大学を変更する</button>
              </div>
            </div>

            {simLoading ? (
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"200px", gap:"16px"}}>
                <div style={{width:"36px", height:"36px", border:"3px solid var(--border)", borderTopColor:"var(--coral)", borderRadius:"50%", animation:"spin .7s linear infinite"}}/>
                <div>
                  <p style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"4px", textAlign:"center"}}>シミュレーション中...</p>
                  <p style={{fontSize:"12px", color:"var(--ink3)", textAlign:"center"}}>{selected.size}校のデータを分析しています</p>
                </div>
              </div>
            ) : (
              <>
                {/* 改善4: 達成感サマリーカード */}
                {simData.length > 0 && (() => {
                  const sOnly = simData.filter(u => u.records.every(r => r.application_type === "専願"))
                  const hOk = simData.filter(u => u.records.some(r => r.application_type === "併願"))
                  let eSum = 0
                  simData.forEach(u => { const c = parseCost(u.records[0]?.cost || ""); eSum += c.exam || 0 })
                  return (
                    <div style={{
                      background:"linear-gradient(135deg,#134e4a,#0f766e)", borderRadius:"20px",
                      padding:"24px 28px", marginBottom:"20px", color:"#fff", position:"relative", overflow:"hidden"
                    }}>
                      <div style={{position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 8px)", pointerEvents:"none"}}/>
                      <div style={{position:"relative", zIndex:1}}>
                        <div style={{fontSize:"18px", fontWeight:700, marginBottom:"12px"}}>
                          🎉 {simData.length}校の比較が完成しました！
                        </div>
                        <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
                          {eSum > 0 && (
                            <div style={{background:"rgba(255,255,255,.1)", borderRadius:"12px", padding:"10px 16px", textAlign:"center"}}>
                              <div style={{fontSize:"20px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#5eead4"}}>{Math.round(eSum/10000)}万円</div>
                              <div style={{fontSize:"10px", color:"rgba(255,255,255,.6)", marginTop:"2px"}}>受験料合計</div>
                            </div>
                          )}
                          <div style={{background:"rgba(255,255,255,.1)", borderRadius:"12px", padding:"10px 16px", textAlign:"center"}}>
                            <div style={{fontSize:"20px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#5eead4"}}>{hOk.length}校</div>
                            <div style={{fontSize:"10px", color:"rgba(255,255,255,.6)", marginTop:"2px"}}>併願可能</div>
                          </div>
                          {sOnly.length > 0 && (
                            <div style={{background:"rgba(225,29,72,.2)", borderRadius:"12px", padding:"10px 16px", textAlign:"center"}}>
                              <div style={{fontSize:"20px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#fca5a5"}}>{sOnly.length}校</div>
                              <div style={{fontSize:"10px", color:"rgba(255,255,255,.6)", marginTop:"2px"}}>専願のみ（要注意）</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
                <SimResult
                  data={simData} rightTab={rightTab} setRightTab={setRightTab}
                  userId={userId} myTargets={myTargets} savingUni={savingUni} onSave={saveToTargets}
                  filterDeptMode={filterDeptMode} setFilterDeptMode={setFilterDeptMode}
                  hiddenDepts={hiddenDepts} setHiddenDepts={setHiddenDepts}
                  purpose={purpose}
                />
              </>
            )}

            {/* 他のシミュレーションへの誘導 */}
            {!simLoading && purpose && (
              <div style={{marginTop:"24px", padding:"20px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"18px"}}>
                <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"12px"}}>他の視点でもチェックしませんか？</div>
                <div style={{display:"flex", gap:"10px", flexWrap:"wrap"}}>
                  {(["cost","timeline","heigan"] as Purpose[]).filter(p => p !== purpose).map(p => {
                    const c = PURPOSE_CONFIG[p]
                    return (
                      <button key={p} onClick={() => {
                        setPurpose(p)
                        if (p === "cost") setRightTab("cost")
                        else if (p === "timeline") setRightTab("timeline")
                        else setRightTab("heigan")
                      }} className="purpose-card" style={{
                        padding:"10px 18px", borderRadius:"12px", border:"1.5px solid var(--border)",
                        background:"var(--surface)", cursor:"pointer", fontFamily:"inherit",
                        fontSize:"13px", fontWeight:600, color:"var(--ink2)", display:"flex", alignItems:"center", gap:"6px",
                        transition:"all .2s ease"
                      }}>
                        {c.icon} {c.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* プレミアム CTA */}
            <div style={{marginTop:"20px"}}>
              <div style={{background:"linear-gradient(135deg,var(--premium),#2d2825)", borderRadius:"20px", padding:"24px", display:"flex", alignItems:"center", gap:"20px", flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"15px", fontWeight:800, color:"#fff", marginBottom:"4px"}}>「自分はどこを受ければいいの？」を解決しませんか？</div>
                  <div style={{fontSize:"12px", color:"rgba(255,255,255,.6)", lineHeight:1.6}}>AI問診でプロフィールを作成すると、あなたに合った大学・選抜方法・穴場校をサジェストします。</div>
                </div>
                <Link href="/signup" style={{flexShrink:0, padding:"11px 24px", borderRadius:"12px", background:"linear-gradient(135deg,var(--coral),var(--coral2))", color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", whiteSpace:"nowrap"}}>プレミアムで診断する →</Link>
              </div>
            </div>

            {/* データ出典 */}
            <div style={{marginTop:"16px", padding:"12px 16px", background:"var(--surface2)", borderRadius:"10px", fontSize:"11px", color:"var(--ink3)", lineHeight:1.7}}>
              📋 データ出典：各大学が公開する2026年度募集要項に基づいています。最新の正確な情報は必ず<a href="https://www.mext.go.jp/" target="_blank" rel="noopener noreferrer" style={{color:"var(--teal)", textDecoration:"none"}}>各大学の公式サイト</a>でご確認ください。
            </div>
          </div>
        )}
      </div>

      {/* 未ログイン登録促進モーダル */}
      {showSignupModal && (
        <div onClick={() => setShowSignupModal(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:1000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:"24px"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"var(--surface)", borderRadius:"24px", padding:"40px 32px",
            maxWidth:"400px", width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.3)",
            textAlign:"center", position:"relative"
          }}>
            <button onClick={() => setShowSignupModal(false)} style={{
              position:"absolute", top:"16px", right:"18px", background:"transparent",
              border:"none", fontSize:"18px", color:"var(--ink3)", cursor:"pointer", lineHeight:1
            }}>✕</button>
            <div style={{fontSize:"48px", marginBottom:"14px"}}>🔖</div>
            <h2 style={{fontFamily:"Zen Maru Gothic,sans-serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"10px"}}>
              志望校を保存しませんか？
            </h2>
            <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"24px"}}>
              アカウント登録（無料）で志望校を保存できます。<br/>
              タスク自動生成・AI診断など全機能が使えるプレミアムプランもあります。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"16px"}}>
              <Link href="/signup" style={{
                display:"block", padding:"14px", borderRadius:"14px",
                background:"linear-gradient(135deg,var(--coral),var(--coral2))",
                color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none",
                boxShadow:"0 4px 16px rgba(249,112,102,.3)"
              }}>無料登録して保存する →</Link>
              <Link href="/login" style={{
                display:"block", padding:"12px", borderRadius:"14px",
                border:"1.5px solid var(--border)", color:"var(--ink2)",
                fontSize:"13px", fontWeight:600, textDecoration:"none"
              }}>ログインして保存する</Link>
            </div>
            <button onClick={() => setShowSignupModal(false)} style={{
              background:"transparent", border:"none", fontSize:"12px",
              color:"var(--ink3)", cursor:"pointer", fontFamily:"inherit"
            }}>今は登録しない</button>
          </div>
        </div>
      )}

      {/* スマホ用フローティングボタン（Step 2: シミュレーション開始 / Step 3: 大学を変更） */}
      {purpose && (step === 2 && selected.size > 0 || step === 3) && (
        <div className="mobile-float-btn" style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:200,
          padding:"12px 20px", paddingBottom:"calc(12px + env(safe-area-inset-bottom, 0px))",
          background:"rgba(250,250,250,.96)", backdropFilter:"blur(12px)",
          borderTop:"1px solid var(--border)", boxShadow:"0 -4px 20px rgba(0,0,0,.08)",
          display:"none"
        }}>
          {step === 2 ? (
            <button onClick={runSimulation} disabled={simLoading} style={{
              width:"100%", padding:"14px", borderRadius:"14px", border:"none",
              background:"linear-gradient(135deg,var(--coral),var(--coral2))",
              color:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer",
              fontFamily:"inherit", boxShadow:"0 4px 16px rgba(249,112,102,.3)"
            }}>
              {simLoading ? "シミュレーション中..." : `${PURPOSE_CONFIG[purpose!].icon} ${selected.size}校でシミュレーション開始`}
            </button>
          ) : (
            <button onClick={() => { setStep(2); setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: "smooth" }), 100) }} style={{
              width:"100%", padding:"14px", borderRadius:"14px", border:"1.5px solid var(--border)",
              background:"var(--surface)", color:"var(--ink2)", fontSize:"14px", fontWeight:700,
              cursor:"pointer", fontFamily:"inherit"
            }}>
              ← 大学を変更して再シミュレーション
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .purpose-card:hover { transform: translateY(-3px) !important; box-shadow: 0 6px 24px rgba(249,112,102,.15) !important; }
        .uni-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,.08) !important; }
        @media (max-width: 767px) {
          .purpose-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .step2-layout { flex-direction: column !important; }
          .step2-right { width: 100% !important; min-width: 0 !important; position: static !important; }
          .sim-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mobile-float-btn { display: block !important; }
        }
        @media (min-width: 768px) {
          .mobile-float-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function SimResult({ data, rightTab, setRightTab, userId, myTargets, savingUni, onSave, filterDeptMode, setFilterDeptMode, hiddenDepts, setHiddenDepts, purpose }: {
  data: UniGroup[]
  rightTab: string
  setRightTab: (t: string) => void
  userId: string | null
  myTargets: MyTarget[]
  savingUni: string | null
  onSave: (uniName: string, facultyName: string, deptName: string) => void
  filterDeptMode: boolean
  setFilterDeptMode: (v: boolean) => void
  hiddenDepts: Set<string>
  setHiddenDepts: (v: Set<string>) => void
  purpose: Purpose | null
}) {
  const filteredData = filterDeptMode
    ? data.map(u => ({
        ...u,
        records: u.records.filter(r => !hiddenDepts.has(`${u.name}||${r.faculty_name}||${r.department_name}`))
      })).filter(u => u.records.length > 0)
    : data

  const sOnly = filteredData.filter(u => u.records.every(r => r.application_type === "専願"))
  const hOk = filteredData.filter(u => u.records.some(r => r.application_type === "併願"))
  let eSum = 0
  filteredData.forEach(u => { const c = parseCost(u.records[0]?.cost || ""); eSum += c.exam || 0 })

  const toggleHidden = (key: string) => {
    const next = new Set(hiddenDepts)
    if (next.has(key)) next.delete(key); else next.add(key)
    setHiddenDepts(next)
  }

  const totalDepts = data.reduce((s, u) => s + u.records.length, 0)
  const visibleDepts = filterDeptMode
    ? data.reduce((s, u) => s + u.records.filter(r => !hiddenDepts.has(`${u.name}||${r.faculty_name}||${r.department_name}`)).length, 0)
    : totalDepts

  return (
    <div>
      {/* サマリーカード */}
      <div className="sim-stats-grid" style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"18px"}}>
        {[
          {l:"選択大学", v:data.length, sub:"校", color:"var(--blue)", grad:"linear-gradient(90deg,var(--blue),#818cf8)"},
          {l:"専願のみ", v:sOnly.length, sub:"校（要注意）", color:"#e11d48", grad:"linear-gradient(90deg,#e11d48,#ec4899)"},
          {l:"併願可能", v:hOk.length, sub:"校", color:"var(--teal)", grad:"linear-gradient(90deg,var(--teal),#06b6d4)"},
          {l:"受験料目安", v:eSum>0?Math.round(eSum/10000)+"万":"—", sub:eSum>0?"円（概算）":"", color:"var(--amber)", grad:"linear-gradient(90deg,var(--amber),#f97316)"},
        ].map((k,i) => (
          <div key={i} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"16px", padding:"16px", position:"relative", overflow:"hidden"}}>
            <div style={{position:"absolute", top:0, left:0, right:0, height:"3px", background:k.grad, borderRadius:"16px 16px 0 0"}}/>
            <div style={{fontSize:"9px", color:"var(--ink3)", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"6px"}}>{k.l}</div>
            <div style={{fontSize:"26px", fontWeight:900, fontFamily:"DM Mono,monospace", lineHeight:1, color:k.color}}>{k.v}</div>
            <div style={{fontSize:"10px", color:"var(--ink3)", marginTop:"3px"}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {sOnly.length > 0 && (
        <div style={{marginBottom:"16px", background:"rgba(225,29,72,.07)", border:"1.5px solid rgba(225,29,72,.2)", borderRadius:"16px", padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px"}}>
          <span style={{fontSize:"20px", flexShrink:0}}>⚠️</span>
          <div>
            <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"2px"}}>専願のみの大学が {sOnly.length} 校あります</div>
            <div style={{fontSize:"11px", color:"#9f1239", lineHeight:1.6}}>
              {sOnly.map(u => u.name).join("・")} は専願のみです。不合格時に他大学を受験できないため、出願前に十分ご確認ください。
            </div>
          </div>
        </div>
      )}

      {/* タブ */}
      <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"18px", overflow:"hidden", boxShadow:"var(--sh-sm)"}}>
        <div style={{padding:"12px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap"}}>
          <div style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginRight:"auto"}}>
            {data.length}大学 / {filterDeptMode ? `${visibleDepts}/${totalDepts}学科` : `${totalDepts}学科`}
          </div>
          <div className="sim-tabs" style={{display:"flex", gap:"4px", background:"var(--surface2)", borderRadius:"12px", padding:"4px"}}>
            {[{id:"detail",l:"📋 詳細"},{id:"timeline",l:"📅 日程"},{id:"cost",l:"💰 費用"},{id:"heigan",l:"⚡ 併願"},{id:"parent",l:"👨‍👩‍👧 保護者"}].map(t => (
              <button key={t.id} onClick={() => setRightTab(t.id)} style={{
                padding:"7px 14px", borderRadius:"10px", border:"none", fontFamily:"inherit",
                background: rightTab===t.id?"var(--surface)":"transparent",
                color: rightTab===t.id?"var(--coral)":"var(--ink2)",
                fontSize:"11px", fontWeight:700, cursor:"pointer", whiteSpace:"nowrap",
                boxShadow: rightTab===t.id?"var(--sh-sm)":"none",
                transition:".15s"
              }}>{t.l}</button>
            ))}
          </div>
          {rightTab === "detail" && (
            <button onClick={() => {
              setFilterDeptMode(!filterDeptMode)
              if (filterDeptMode) setHiddenDepts(new Set())
            }} style={{
              padding:"7px 14px", borderRadius:"10px", fontFamily:"inherit",
              background: filterDeptMode ? "var(--coral-bg)" : "var(--surface2)",
              color: filterDeptMode ? "var(--coral)" : "var(--ink3)",
              fontSize:"11px", fontWeight:700, cursor:"pointer", whiteSpace:"nowrap",
              border: filterDeptMode ? "1.5px solid var(--coral-border)" : "1.5px solid var(--border)",
            } as React.CSSProperties}>
              {filterDeptMode ? "✕ 絞込解除" : "🔍 学科を絞る"}
            </button>
          )}
        </div>

        <div style={{padding:"16px"}}>
          {rightTab === "detail" && <DetailTab data={data} userId={userId} myTargets={myTargets} savingUni={savingUni} onSave={onSave} filterDeptMode={filterDeptMode} hiddenDepts={hiddenDepts} onToggleHidden={toggleHidden} />}
          {rightTab === "timeline" && <TimelineTab data={filteredData} />}
          {rightTab === "cost" && <CostTab data={filteredData} />}
          {rightTab === "heigan" && <HeiganTab data={filteredData} />}
          {rightTab === "parent" && <ParentTab data={filteredData} />}
        </div>
      </div>
    </div>
  )
}

function DetailTab({ data, userId, myTargets, savingUni, onSave, filterDeptMode, hiddenDepts, onToggleHidden }: {
  data: UniGroup[]
  userId: string | null
  myTargets: MyTarget[]
  savingUni: string | null
  onSave: (uniName: string, facultyName: string, deptName: string) => void
  filterDeptMode: boolean
  hiddenDepts: Set<string>
  onToggleHidden: (key: string) => void
}) {
  return (
    <div>
      {filterDeptMode && (
        <div style={{marginBottom:"10px", padding:"10px 14px", background:"var(--coral-bg)", border:"1.5px solid var(--coral-border)", borderRadius:"12px", fontSize:"12px", color:"var(--coral)", fontWeight:600}}>
          🔍 絞込モード：チェックを外した学科は非表示になります
        </div>
      )}
      {data.map(({ name, records }) => {
        const hasH = records.some(r => r.application_type === "併願")
        const hasS = records.some(r => r.application_type === "専願")
        const visibleRecords = filterDeptMode
          ? records.filter(r => !hiddenDepts.has(`${name}||${r.faculty_name}||${r.department_name}`))
          : records
        if (filterDeptMode && visibleRecords.length === 0) return null
        return (
          <div key={name} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"16px", marginBottom:"14px", overflow:"hidden", boxShadow:"var(--sh-sm)"}}>
            <div style={{padding:"14px 18px", background:"linear-gradient(135deg,rgba(249,112,102,.03),rgba(251,146,60,.03))", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", flexWrap:"wrap"}}>
              <div style={{fontSize:"14px", fontWeight:800, color:"var(--ink)", display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap"}}>
                {name}
                {(!hasH && hasS) ? <span style={{fontSize:"9px",padding:"2px 8px",borderRadius:"20px",background:"rgba(225,29,72,.08)",color:"#e11d48",border:"1px solid rgba(225,29,72,.15)",fontWeight:700}}>⚠ 専願のみ</span> :
                  hasH ? <span style={{fontSize:"9px",padding:"2px 8px",borderRadius:"20px",background:"rgba(13,148,136,.08)",color:"var(--teal2)",border:"1px solid rgba(13,148,136,.15)",fontWeight:700}}>✓ 併願可</span> : null}
              </div>
              <div style={{fontSize:"11px", color:"var(--ink3)"}}>{filterDeptMode ? `${visibleRecords.length}/${records.length}` : records.length}学科</div>
            </div>
            <div style={{overflowX:"auto"}}>
            <table style={{width:"100%", borderCollapse:"collapse", minWidth:"600px"}}>
              <thead>
                <tr>
                  {filterDeptMode && <th style={{padding:"8px 8px", textAlign:"center", fontSize:"9px", fontWeight:700, color:"var(--ink3)", background:"var(--surface2)", borderBottom:"1px solid var(--border)", width:"28px"}}>表示</th>}
                  {["学部・学科","区分","出願期間","試験日程","結果発表","費用概算"].map(h => (
                    <th key={h} style={{padding:"8px 14px", textAlign:"left", fontSize:"9px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink3)", background:"var(--surface2)", borderBottom:"1px solid var(--border)"}}>{h}</th>
                  ))}
                  <th style={{padding:"8px 8px", textAlign:"center", fontSize:"9px", fontWeight:700, color:"var(--ink3)", background:"var(--surface2)", borderBottom:"1px solid var(--border)", width:"80px"}}>志望校</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const deptKey = `${name}||${r.faculty_name}||${r.department_name}`
                  const isHidden = hiddenDepts.has(deptKey)
                  if (filterDeptMode && isHidden) return null
                  const saveKey = `${name}||${r.faculty_name}||${r.department_name}`
                  const isSaved = myTargets.some(t => t.university_name === name && t.faculty_name === r.faculty_name && t.department === r.department_name)
                  const isSaving = savingUni === saveKey
                  const c = parseCost(r.cost)
                  const cs = c.exam > 0 ? `受験料 ${fmt(c.exam)}円` : (r.cost?.slice(0,30) || "no data")
                  return (
                    <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.04)", opacity: filterDeptMode && isHidden ? 0.3 : 1}}>
                      {filterDeptMode && (
                        <td style={{padding:"10px 8px", textAlign:"center"}}>
                          <div onClick={() => onToggleHidden(deptKey)} style={{
                            width:"16px", height:"16px", margin:"auto", borderRadius:"5px", cursor:"pointer",
                            border:`1.5px solid ${!isHidden?"var(--teal)":"var(--border)"}`,
                            background: !isHidden?"var(--teal)":"transparent",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"8px", color:"#fff"
                          }}>{!isHidden?"✓":""}</div>
                        </td>
                      )}
                      <td style={{padding:"10px 14px"}}><div style={{fontWeight:600,color:"var(--ink)",fontSize:"12px"}}>{r.faculty_name} {r.department_name}</div><div style={{fontSize:"10px",color:"var(--ink3)",marginTop:"2px"}}>{r.exam_type}</div></td>
                      <td style={{padding:"10px 8px", whiteSpace:"nowrap"}}>
                        {r.application_type==="専願"?<span style={{fontSize:"9px",padding:"2px 6px",borderRadius:"20px",background:"rgba(225,29,72,.08)",color:"#e11d48",border:"1px solid rgba(225,29,72,.15)",fontWeight:700}}>専願</span>:
                        r.application_type==="併願"?<span style={{fontSize:"9px",padding:"2px 6px",borderRadius:"20px",background:"rgba(13,148,136,.08)",color:"var(--teal2)",border:"1px solid rgba(13,148,136,.15)",fontWeight:700}}>併願</span>:
                        <span style={{fontSize:"9px",padding:"2px 6px",borderRadius:"20px",background:"var(--surface2)",color:"var(--ink3)",fontWeight:700}}>{r.application_type}</span>}
                      </td>
                      <td style={{padding:"10px 14px",fontSize:"11px",color:"var(--ink2)",whiteSpace:"pre-line",lineHeight:1.6}}>{r.application_start?.slice(0,60)||"—"}</td>
                      <td style={{padding:"10px 14px",fontSize:"11px",color:"var(--ink2)",whiteSpace:"pre-line",lineHeight:1.6}}>{r.exam_date?.slice(0,60)||"—"}</td>
                      <td style={{padding:"10px 14px",fontSize:"11px",color:"var(--ink2)",whiteSpace:"pre-line",lineHeight:1.6}}>{r.result_date?.slice(0,40)||"—"}</td>
                      <td style={{padding:"10px 14px",fontSize:"10px",color:"var(--ink2)",fontFamily:"DM Mono,monospace"}}>{cs}</td>
                      <td style={{padding:"10px 8px", textAlign:"center"}}>
                        <button onClick={() => onSave(name, r.faculty_name, r.department_name)} disabled={isSaving} style={{
                          padding:"5px 12px", borderRadius:"10px", cursor:"pointer", fontFamily:"inherit",
                          background: isSaved ? "var(--coral-bg)" : "var(--surface2)",
                          color: isSaved ? "var(--coral)" : "var(--ink3)",
                          fontSize:"10px", fontWeight:700,
                          border: isSaved ? "1.5px solid var(--coral-border)" : "1.5px solid var(--border)",
                          opacity: isSaving ? 0.5 : 1, transition:".15s", whiteSpace:"nowrap"
                        } as React.CSSProperties}>
                          {isSaving ? "..." : isSaved ? "🔖 保存済" : "🔖 保存"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
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
    <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"16px", overflow:"hidden"}}>
      <div style={{display:"flex", gap:"14px", padding:"10px 16px", borderBottom:"1px solid var(--border)", background:"var(--surface2)", flexWrap:"wrap"}}>
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
      <div style={{background:"var(--blue-bg)", border:"1.5px solid var(--blue-border)", borderRadius:"16px", padding:"16px 18px", marginBottom:"14px"}}>
        <div style={{fontSize:"13px", fontWeight:700, color:"var(--blue)", marginBottom:"6px"}}>💡 費用シミュレーション</div>
        <div style={{fontSize:"12px", color:"var(--ink2)", lineHeight:1.7}}>データは各大学の募集要項に基づきます。必ず公式サイトでご確認ください。</div>
      </div>
      <div style={{borderRadius:"16px", overflow:"hidden", border:"1.5px solid var(--border)"}}>
      <table style={{width:"100%", borderCollapse:"collapse", background:"var(--surface)"}}>
        <thead><tr>{["大学名","受験料","入学金","授業料（年額）","詳細"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"9px",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--ink3)",background:"var(--surface2)",borderBottom:"1px solid var(--border)"}}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <td style={{padding:"10px 14px",fontWeight:700,color:"var(--ink)",fontSize:"12px"}}>{r.name}</td>
              <td style={{padding:"10px 14px",fontFamily:"DM Mono,monospace",color:"var(--ink)",fontWeight:600}}>{r.exam>0?fmt(r.exam)+"円":"—"}</td>
              <td style={{padding:"10px 14px",fontFamily:"DM Mono,monospace",color:"var(--ink)",fontWeight:600}}>{r.nyuugaku>0?fmt(r.nyuugaku)+"円":"—"}</td>
              <td style={{padding:"10px 14px",fontFamily:"DM Mono,monospace",color:"var(--ink)",fontWeight:600}}>{r.jugyou>0?fmt(r.jugyou)+"円":"—"}</td>
              <td style={{padding:"10px 14px",fontSize:"10px",color:"var(--ink3)",whiteSpace:"pre-line",lineHeight:1.5}}>{String(r.raw).slice(0,60)}</td>
            </tr>
          ))}
          <tr style={{borderTop:"2px solid rgba(249,112,102,.2)"}}>
            <td style={{padding:"10px 14px",fontWeight:700,background:"var(--coral-bg)"}}>合計</td>
            <td style={{padding:"10px 14px",fontFamily:"DM Mono,monospace",color:"var(--coral)",fontWeight:700,background:"var(--coral-bg)"}}>{eSum>0?fmt(eSum)+"円":"—"}</td>
            <td style={{padding:"10px 14px",fontFamily:"DM Mono,monospace",fontWeight:700,background:"var(--coral-bg)"}}>{nSum>0?fmt(nSum)+"円":"—"}</td>
            <td colSpan={2} style={{padding:"10px 14px",fontSize:"10px",color:"var(--ink3)",background:"var(--coral-bg)"}}>初年度目安: {fy>0?"〜"+fmt(fy)+"円":""}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  )
}

function HeiganTab({ data }: { data: UniGroup[] }) {
  const sOnly = data.filter(u=>u.records.every(r=>r.application_type==="専願"))
  const hOk = data.filter(u=>u.records.some(r=>r.application_type==="併願"))
  const unk = data.filter(u=>!sOnly.includes(u)&&!hOk.includes(u))
  return (
    <div>
      {sOnly.length>0&&<div style={{borderRadius:"16px",padding:"16px 18px",marginBottom:"14px",background:"rgba(225,29,72,.05)",border:"1.5px solid rgba(225,29,72,.15)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#e11d48",marginBottom:"6px"}}>⚠️ 専願のみ — {sOnly.length}校</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{sOnly.map(u=><span key={u.name} style={{padding:"4px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:600,background:"rgba(225,29,72,.08)",color:"#e11d48",border:"1px solid rgba(225,29,72,.18)"}}>{u.name}</span>)}</div>
      </div>}
      {hOk.length>0&&<div style={{borderRadius:"16px",padding:"16px 18px",marginBottom:"14px",background:"rgba(13,148,136,.05)",border:"1.5px solid rgba(13,148,136,.15)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--teal2)",marginBottom:"6px"}}>✅ 併願可能 — {hOk.length}校</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{hOk.map(u=><span key={u.name} style={{padding:"4px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:600,background:"rgba(13,148,136,.08)",color:"var(--teal2)",border:"1px solid rgba(13,148,136,.18)"}}>{u.name}</span>)}</div>
      </div>}
      {unk.length>0&&<div style={{borderRadius:"16px",padding:"16px 18px",marginBottom:"14px",background:"var(--amber-bg)",border:"1.5px solid var(--amber-border)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--amber)",marginBottom:"6px"}}>❓ 要確認 — {unk.length}校</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{unk.map(u=><span key={u.name} style={{padding:"4px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:600,background:"var(--surface2)",color:"var(--ink3)"}}>{u.name}</span>)}</div>
      </div>}
    </div>
  )
}

function ParentTab({ data }: { data: UniGroup[] }) {
  const sOnly = data.filter(u=>u.records.every(r=>r.application_type==="専願"))
  let eSum=0; data.forEach(u=>{const c=parseCost(u.records[0]?.cost||"");eSum+=c.exam||0})
  return (
    <div>
      <div style={{borderRadius:"16px",padding:"16px 18px",marginBottom:"14px",background:"var(--blue-bg)",border:"1.5px solid var(--blue-border)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--blue)",marginBottom:"6px"}}>👨‍👩‍👧 保護者の方へ</div>
        <div style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.7}}>総合型選抜は出願時期・選考内容が大学によって大きく異なります。早めの情報収集と、お子さんとの定期的な確認が合格への鍵です。</div>
      </div>
      {sOnly.length>0&&<div style={{borderRadius:"16px",padding:"16px 18px",marginBottom:"14px",background:"rgba(225,29,72,.05)",border:"1.5px solid rgba(225,29,72,.15)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#e11d48",marginBottom:"6px"}}>⚠️ 専願のみ（{sOnly.length}校） — 重要</div>
        <div style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.7}}>{sOnly.map(u=>u.name).join("、")}は専願です。合格後に辞退すると高校の推薦枠に影響する可能性があります。</div>
      </div>}
      {eSum>0&&<div style={{borderRadius:"16px",padding:"16px 18px",marginBottom:"14px",background:"var(--blue-bg)",border:"1.5px solid var(--blue-border)"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"var(--blue)",marginBottom:"6px"}}>💰 受験料目安: {fmt(eSum)}円（{data.length}校分）</div>
        <div style={{fontSize:"12px",color:"var(--ink2)",lineHeight:1.7}}>交通費・宿泊費・書類郵送費・参考書代は含まれていません。余裕を持った資金計画を。</div>
      </div>}
    </div>
  )
}
