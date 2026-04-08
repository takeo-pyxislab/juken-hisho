"use client"

import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{background:"var(--bg)", minHeight:"100vh", fontFamily:"Noto Sans JP,sans-serif"}}>
      {/* ナビ */}
      <nav style={{
        position:"sticky", top:0, zIndex:300, height:"58px", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(248,247,244,.96)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:"9px", textDecoration:"none"}}>
          <div style={{width:"30px", height:"30px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px"}}>📖</div>
          <div>
            <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"16px", fontWeight:700, color:"var(--ink)"}}>ユニパス</div>
            <div style={{fontSize:"10px", color:"var(--ink3)"}}>総合型選抜ナビ</div>
          </div>
        </Link>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <Link href="/simulator" style={{padding:"7px 16px", borderRadius:"8px", background:"var(--teal)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>無料で試す</Link>
        </div>
      </nav>

      <article style={{maxWidth:"740px", margin:"0 auto", padding:"48px 24px 80px"}}>
        {/* パンくず */}
        <div style={{fontSize:"12px", color:"var(--ink3)", marginBottom:"24px"}}>
          <Link href="/" style={{color:"var(--teal)", textDecoration:"none"}}>トップ</Link>
          <span style={{margin:"0 8px"}}>/</span>
          <span>お問い合わせ</span>
        </div>

        <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"12px"}}>
          お問い合わせ
        </h1>
        <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"32px"}}>
          ユニパスに関するご質問、不具合のご報告、その他お問い合わせは以下のフォームよりお送りください。
        </p>

        {/* メール案内 */}
        <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px", marginBottom:"32px"}}>
          <div style={{display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:"12px", color:"var(--ink3)", marginBottom:"4px"}}>メールでのお問い合わせ</div>
              <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)"}}>support@unipath.jp</div>
            </div>
            <div style={{marginLeft:"auto", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"8px", padding:"6px 12px"}}>
              <div style={{fontSize:"11px", color:"var(--teal2)", fontWeight:600}}>回答目安：3営業日以内</div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div style={{background:"var(--teal-bg)", border:"2px solid var(--teal-border)", borderRadius:"16px", padding:"40px 32px", textAlign:"center"}}>
            <div style={{fontSize:"40px", marginBottom:"16px"}}>✅</div>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"12px"}}>
              送信が完了しました
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"8px"}}>
              お問い合わせいただきありがとうございます。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"24px"}}>
              3営業日以内にご入力のメールアドレス宛にご回答いたします。
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", message: "" }) }}
              style={{
                padding:"10px 24px", borderRadius:"8px", border:"1.5px solid var(--border)",
                background:"var(--surface)", color:"var(--ink2)", fontSize:"13px", fontWeight:600,
                cursor:"pointer"
              }}
            >
              新しいお問い合わせを送る
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            {/* 名前 */}
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>
                お名前 <span style={{color:"#e11d48", fontSize:"11px"}}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="山田 太郎"
                style={{
                  width:"100%", padding:"12px 16px", borderRadius:"10px",
                  border:"1.5px solid var(--border)", background:"var(--surface)",
                  fontSize:"14px", color:"var(--ink)", outline:"none",
                  fontFamily:"Noto Sans JP,sans-serif", boxSizing:"border-box"
                }}
              />
            </div>

            {/* メール */}
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>
                メールアドレス <span style={{color:"#e11d48", fontSize:"11px"}}>*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                placeholder="example@email.com"
                style={{
                  width:"100%", padding:"12px 16px", borderRadius:"10px",
                  border:"1.5px solid var(--border)", background:"var(--surface)",
                  fontSize:"14px", color:"var(--ink)", outline:"none",
                  fontFamily:"Noto Sans JP,sans-serif", boxSizing:"border-box"
                }}
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>
                お問い合わせ種別 <span style={{color:"#e11d48", fontSize:"11px"}}>*</span>
              </label>
              <select
                required
                value={form.category}
                onChange={e => setForm(f => ({...f, category: e.target.value}))}
                style={{
                  width:"100%", padding:"12px 16px", borderRadius:"10px",
                  border:"1.5px solid var(--border)", background:"var(--surface)",
                  fontSize:"14px", color: form.category ? "var(--ink)" : "var(--ink3)", outline:"none",
                  fontFamily:"Noto Sans JP,sans-serif", boxSizing:"border-box",
                  appearance:"auto"
                }}
              >
                <option value="" disabled>選択してください</option>
                <option value="サービスについて">サービスについて</option>
                <option value="不具合報告">不具合報告</option>
                <option value="退会・解約">退会・解約</option>
                <option value="データ削除依頼">データ削除依頼</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* メッセージ */}
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>
                お問い合わせ内容 <span style={{color:"#e11d48", fontSize:"11px"}}>*</span>
              </label>
              <textarea
                required
                value={form.message}
                onChange={e => setForm(f => ({...f, message: e.target.value}))}
                placeholder="お問い合わせ内容を入力してください"
                rows={6}
                style={{
                  width:"100%", padding:"12px 16px", borderRadius:"10px",
                  border:"1.5px solid var(--border)", background:"var(--surface)",
                  fontSize:"14px", color:"var(--ink)", outline:"none", resize:"vertical",
                  fontFamily:"Noto Sans JP,sans-serif", lineHeight:1.8, boxSizing:"border-box"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding:"14px", borderRadius:"12px",
                background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                color:"#fff", fontSize:"15px", fontWeight:700,
                border:"none", cursor:"pointer",
                boxShadow:"0 4px 16px rgba(13,148,136,.3)"
              }}
            >
              送信する
            </button>

            <p style={{fontSize:"11px", color:"var(--ink3)", lineHeight:1.6, textAlign:"center"}}>
              送信することで、<Link href="/legal/privacy" style={{color:"var(--teal)", textDecoration:"none"}}>プライバシーポリシー</Link>に同意したものとみなします。
            </p>
          </form>
        )}
      </article>

      {/* フッター */}
      <footer style={{background:"var(--premium)", padding:"32px 24px", textAlign:"center"}}>
        <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"18px", color:"#fff", marginBottom:"6px"}}>ユニパス</div>
        <div style={{fontSize:"12px", color:"rgba(255,255,255,.4)", marginBottom:"16px"}}>総合型選抜ナビ · 2026年度対応</div>
        <div style={{display:"flex", gap:"20px", justifyContent:"center", flexWrap:"wrap"}}>
          <Link href="/legal/terms" style={{fontSize:"12px", color:"rgba(255,255,255,.4)", textDecoration:"none"}}>利用規約</Link>
          <Link href="/legal/privacy" style={{fontSize:"12px", color:"rgba(255,255,255,.4)", textDecoration:"none"}}>プライバシーポリシー</Link>
          <Link href="/legal/disclaimer" style={{fontSize:"12px", color:"rgba(255,255,255,.4)", textDecoration:"none"}}>免責事項</Link>
          <Link href="/legal/contact" style={{fontSize:"12px", color:"rgba(255,255,255,.4)", textDecoration:"none"}}>お問い合わせ</Link>
        </div>
      </footer>
    </div>
  )
}
