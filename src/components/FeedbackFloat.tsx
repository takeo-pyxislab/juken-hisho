"use client"
import { useState } from "react"
import Link from "next/link"

const MOODS = [
  { emoji: "😊", label: "便利！", tag: "便利" },
  { emoji: "🤔", label: "ここ改善", tag: "改善希望" },
  { emoji: "💡", label: "ほしい機能", tag: "機能リクエスト" },
]

export default function FeedbackFloat() {
  const [open, setOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [text, setText] = useState("")

  const postToX = () => {
    const mood = selectedMood !== null ? MOODS[selectedMood] : null
    const parts: string[] = []
    if (mood) parts.push(`【${mood.tag}】`)
    if (text.trim()) parts.push(text.trim())
    if (!mood && !text.trim()) parts.push("ユニパスを使ってみました！")
    parts.push("")
    parts.push("#ユニパス #総合型選抜")
    const tweet = parts.join("\n")
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`
    window.open(url, "_blank", "noopener,noreferrer,width=550,height=420")
    setOpen(false)
    setSelectedMood(null)
    setText("")
  }

  return (
    <>
      {/* フローティングボタン */}
      {!open && (
        <button onClick={() => setOpen(true)} style={{
          position:"fixed", bottom:"24px", right:"24px", zIndex:900,
          width:"52px", height:"52px", borderRadius:"50%",
          background:"linear-gradient(135deg,var(--teal),#06b6d4)",
          border:"none", cursor:"pointer",
          boxShadow:"0 4px 20px rgba(13,148,136,.35)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"22px", transition:".2s"
        }}>
          💬
        </button>
      )}

      {/* パネル */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position:"fixed", inset:0, zIndex:899, background:"rgba(0,0,0,.3)"
          }}/>
          <div style={{
            position:"fixed", bottom:"24px", right:"24px", zIndex:900,
            width:"340px", maxWidth:"calc(100vw - 32px)",
            background:"var(--surface)", border:"1.5px solid var(--border)",
            borderRadius:"20px", boxShadow:"0 12px 40px rgba(0,0,0,.15)",
            overflow:"hidden"
          }}>
            {/* ヘッダー */}
            <div style={{
              padding:"18px 20px 14px",
              background:"linear-gradient(135deg,#134e4a,#0f766e)",
              position:"relative"
            }}>
              <button onClick={() => setOpen(false)} style={{
                position:"absolute", top:"12px", right:"14px", background:"transparent",
                border:"none", color:"rgba(255,255,255,.5)", fontSize:"16px", cursor:"pointer", lineHeight:1
              }}>✕</button>
              <div style={{fontSize:"15px", fontWeight:700, color:"#fff", marginBottom:"4px"}}>
                💬 ユニパスを一緒に作ろう
              </div>
              <div style={{fontSize:"11px", color:"rgba(255,255,255,.6)", lineHeight:1.5}}>
                あなたの声でサービスが変わります
              </div>
            </div>

            <div style={{padding:"18px 20px"}}>
              {/* 気分ボタン */}
              <div style={{display:"flex", gap:"8px", marginBottom:"14px"}}>
                {MOODS.map((m, i) => (
                  <button key={i} onClick={() => setSelectedMood(selectedMood === i ? null : i)} style={{
                    flex:1, padding:"10px 4px", borderRadius:"10px", cursor:"pointer",
                    fontFamily:"inherit", textAlign:"center", transition:".15s",
                    border: selectedMood === i ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                    background: selectedMood === i ? "rgba(13,148,136,.08)" : "var(--surface)",
                  }}>
                    <div style={{fontSize:"22px", marginBottom:"4px"}}>{m.emoji}</div>
                    <div style={{fontSize:"11px", fontWeight:700, color: selectedMood === i ? "var(--teal)" : "var(--ink3)"}}>{m.label}</div>
                  </button>
                ))}
              </div>

              {/* テキスト入力 */}
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="一言あればどうぞ（任意）"
                rows={2}
                style={{
                  width:"100%", padding:"10px 12px", border:"1.5px solid var(--border)",
                  borderRadius:"10px", background:"var(--surface2)", color:"var(--ink)",
                  fontSize:"13px", fontFamily:"inherit", outline:"none", resize:"none",
                  boxSizing:"border-box", marginBottom:"14px"
                }}
              />

              {/* Xで投稿ボタン */}
              <button onClick={postToX} style={{
                width:"100%", padding:"12px", borderRadius:"10px", border:"none",
                background:"#0f1419", color:"#fff",
                fontSize:"14px", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"8px"
              }}>
                <span style={{fontSize:"16px"}}>𝕏</span> ポストする
              </button>

              {/* 説明 */}
              <div style={{marginTop:"12px", padding:"10px 12px", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"8px"}}>
                <div style={{fontSize:"11px", color:"var(--teal2)", lineHeight:1.6}}>
                  投稿いただいた改善案は実装時にXでお知らせします 🙏
                </div>
              </div>

              {/* 問い合わせリンク */}
              <div style={{marginTop:"10px", textAlign:"center"}}>
                <Link href="/legal/contact" onClick={() => setOpen(false)} style={{fontSize:"11px", color:"var(--ink3)", textDecoration:"none"}}>
                  Xアカウントがない方は <span style={{textDecoration:"underline"}}>お問い合わせ</span> へ
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
