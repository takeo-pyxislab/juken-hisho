"use client"
import { useState, Suspense } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません")
      setLoading(false)
    } else {
      if (redirectTo) {
        router.push(redirectTo)
      } else if (data.user?.user_metadata?.user_type === "parent") {
        router.push("/parent")
      } else {
        router.push("/mypage")
      }
    }
  }

  return (
    <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"36px", boxShadow:"var(--sh-lg)"}}>
      <form onSubmit={handleLogin} style={{display:"flex", flexDirection:"column", gap:"16px"}}>
        <div>
          <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>メールアドレス</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="example@email.com"
            style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box"}}
          />
        </div>
        <div>
          <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>パスワード</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            placeholder="パスワードを入力"
            style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box"}}
          />
        </div>

        {error && (
          <div style={{background:"var(--rose-bg)", border:"1px solid var(--rose-border)", borderRadius:"9px", padding:"10px 14px", fontSize:"12px", color:"var(--rose)"}}>
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{width:"100%", padding:"13px", borderRadius:"10px", border:"none", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", marginTop:"4px", opacity:loading?0.7:1}}>
          {loading ? "ログイン中..." : "ログインする →"}
        </button>
      </form>

      <div style={{display:"flex", alignItems:"center", gap:"10px", margin:"16px 0"}}>
        <div style={{flex:1, height:"1px", background:"var(--border)"}}/>
        <span style={{fontSize:"11px", color:"var(--ink3)"}}>または</span>
        <div style={{flex:1, height:"1px", background:"var(--border)"}}/>
      </div>

      <p style={{fontSize:"12px", color:"var(--ink3)", textAlign:"center"}}>
        アカウントをお持ちでないですか？{" "}
        <Link href="/signup" style={{color:"var(--teal)", fontWeight:600, textDecoration:"underline"}}>新規登録</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"var(--bg)"}}>
      <div style={{width:"100%", maxWidth:"440px"}}>
        <div style={{textAlign:"center", marginBottom:"32px"}}>
          <Link href="/" style={{textDecoration:"none", display:"inline-block"}}>
            <img src="/logo.png" alt="ユニパス" style={{height:"120px", objectFit:"contain", margin:"0 auto 12px", display:"block"}} />
          </Link>
          <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginTop:"16px", marginBottom:"6px"}}>ログイン</h1>
          <p style={{fontSize:"13px", color:"var(--ink3)", lineHeight:1.6}}>おかえりなさい</p>
        </div>

        <Suspense fallback={<div style={{height:"200px"}}/>}>
          <LoginForm />
        </Suspense>

        <p style={{textAlign:"center", marginTop:"20px", fontSize:"11px", color:"var(--ink4)"}}>
          <Link href="/" style={{color:"var(--ink3)", textDecoration:"none"}}>← トップに戻る</Link>
        </p>
      </div>
    </div>
  )
}
