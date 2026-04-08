"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function InvitePage() {
  const params = useParams()
  const token = params.token as string
  const [status, setStatus] = useState<"loading"|"authing"|"accepting"|"success"|"error"|"wrong_type">("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setStatus("authing")
        return
      }

      if (user.user_metadata?.user_type === "student") {
        setStatus("wrong_type")
        return
      }

      // ユーザーが既に連携済みかチェック
      if (user.user_metadata?.user_type !== "parent") {
        // user_typeがない場合もparentとして扱う（保護者として登録してない古いアカウント対応）
      }

      setStatus("accepting")
      const res = await fetch("/api/family/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus("success")
        setTimeout(() => router.push("/parent"), 2000)
      } else {
        setStatus("error")
        setErrorMsg(data.error || "連携に失敗しました")
      }
    }
    run()
  }, [])

  const loginUrl = `/login?redirect=/invite/${token}`
  const signupUrl = `/signup?redirect=/invite/${token}`

  return (
    <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"var(--bg)"}}>
      <div style={{width:"100%", maxWidth:"440px"}}>
        <div style={{textAlign:"center", marginBottom:"28px"}}>
          <div style={{width:"52px", height:"52px", background:"linear-gradient(135deg,var(--premium),#3d3530)", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", margin:"0 auto 12px"}}>📖</div>
          <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)"}}>ユニパス</div>
        </div>

        <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"36px", boxShadow:"var(--sh-lg)", textAlign:"center"}}>

          {status === "loading" && (
            <>
              <div style={{width:"40px", height:"40px", border:"4px solid var(--border)", borderTop:"4px solid var(--teal)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px"}}/>
              <p style={{fontSize:"14px", color:"var(--ink3)"}}>確認中...</p>
            </>
          )}

          {status === "authing" && (
            <>
              <div style={{fontSize:"48px", marginBottom:"16px"}}>🔗</div>
              <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"10px"}}>お子さんと連携する</h1>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"28px"}}>
                お子さんの受験情報を閲覧するには<br/>保護者アカウントでログインしてください。
              </p>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                <Link href={loginUrl}
                  style={{display:"block", padding:"13px", borderRadius:"10px", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none"}}>
                  ログインして連携する →
                </Link>
                <Link href={signupUrl}
                  style={{display:"block", padding:"12px", borderRadius:"10px", border:"1.5px solid var(--border)", color:"var(--ink2)", fontSize:"13px", fontWeight:600, textDecoration:"none"}}>
                  アカウント登録から始める
                </Link>
              </div>
            </>
          )}

          {status === "accepting" && (
            <>
              <div style={{width:"40px", height:"40px", border:"4px solid var(--border)", borderTop:"4px solid var(--teal)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px"}}/>
              <p style={{fontSize:"14px", color:"var(--ink3)"}}>連携処理中...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div style={{fontSize:"56px", marginBottom:"16px"}}>🎉</div>
              <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"10px"}}>連携完了！</h1>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"20px"}}>
                お子さんのアカウントと連携されました。<br/>保護者ダッシュボードへ移動します。
              </p>
              <div style={{width:"32px", height:"32px", border:"4px solid var(--border)", borderTop:"4px solid var(--teal)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto"}}/>
            </>
          )}

          {status === "wrong_type" && (
            <>
              <div style={{fontSize:"48px", marginBottom:"16px"}}>⚠️</div>
              <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"10px"}}>このURLは保護者専用です</h1>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"24px"}}>
                このリンクは保護者アカウント向けの招待URLです。受験生アカウントでは使用できません。
              </p>
              <Link href="/mypage" style={{display:"block", padding:"12px", borderRadius:"10px", background:"var(--teal)", color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none"}}>
                マイページへ戻る
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div style={{fontSize:"48px", marginBottom:"16px"}}>❌</div>
              <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"10px"}}>連携できませんでした</h1>
              <p style={{fontSize:"13px", color:"var(--rose)", lineHeight:1.8, marginBottom:"24px"}}>{errorMsg}</p>
              <Link href="/parent" style={{display:"block", padding:"12px", borderRadius:"10px", background:"var(--teal)", color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none"}}>
                保護者ダッシュボードへ
              </Link>
            </>
          )}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
