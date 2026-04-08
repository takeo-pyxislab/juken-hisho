import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "プライバシーポリシー | ユニパス",
  description: "ユニパス（総合型選抜ナビ）のプライバシーポリシーです。個人情報の取り扱い、利用目的、第三者提供などについてご確認ください。",
}

export default function PrivacyPage() {
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
          <img src="/logo.png" alt="ユニパス" style={{width:"32px", height:"32px", objectFit:"contain"}} />
          <div>
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
          <span>プライバシーポリシー</span>
        </div>

        <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"12px"}}>
          プライバシーポリシー
        </h1>
        <p style={{fontSize:"13px", color:"var(--ink3)", marginBottom:"40px"}}>最終更新日：2026年4月1日</p>

        <div style={{display:"flex", flexDirection:"column", gap:"40px"}}>

          <section>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              ユニパス（以下「本サービス」）は、ユーザーの個人情報の保護を重要な責務と考えています。本プライバシーポリシーでは、本サービスにおける個人情報の取り扱いについて説明します。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              1. 収集する情報
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              本サービスでは、以下の情報を収集する場合があります。
            </p>

            <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>アカウント情報</div>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                  メールアドレス、パスワード（ハッシュ化して保存）、ユーザー種別（高校生・保護者）
                </p>
              </div>
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>プロフィール情報</div>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                  学年、志望学部・学科、興味のある活動分野、得意科目など（AI診断のために任意で入力）
                </p>
              </div>
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>大学選択情報</div>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                  シミュレーターで選択した大学・学科、比較履歴、お気に入り登録
                </p>
              </div>
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>利用データ</div>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                  アクセスログ、利用機能の履歴、端末情報（ブラウザ種別・OS）、IPアドレス
                </p>
              </div>
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>決済情報</div>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                  プレミアムプランの決済に必要な情報（クレジットカード情報はStripeが直接管理し、当方のサーバーには保存されません）
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              2. 情報の利用目的
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              収集した情報は、以下の目的で利用します。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              {[
                "本サービスの提供・運営・改善",
                "ユーザーアカウントの管理・認証",
                "AI診断・マッチング提案の精度向上",
                "大学比較シミュレーションの結果表示",
                "プレミアムプランの決済処理",
                "お問い合わせへの対応",
                "サービスに関する重要なお知らせの送信",
                "利用状況の分析によるサービス改善",
              ].map((item, i) => (
                <div key={i} style={{display:"flex", gap:"8px", alignItems:"flex-start"}}>
                  <span style={{color:"var(--teal)", fontWeight:700, minWidth:"16px"}}>・</span>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              3. 第三者サービスとの連携
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              本サービスでは、以下の第三者サービスを利用しています。各サービスにおける個人情報の取り扱いは、各社のプライバシーポリシーに従います。
            </p>
            <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", overflow:"hidden"}}>
              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"var(--surface2)"}}>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink3)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>サービス名</th>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink3)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>利用目的</th>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink3)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>送信される情報</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Supabase", "認証・データベース管理", "メールアドレス、プロフィール情報、利用データ"],
                    ["Stripe", "決済処理", "決済に必要な情報（カード情報はStripeが直接管理）"],
                    ["Anthropic (Claude AI)", "AI診断・文章サポート", "プロフィール情報、入力されたテキスト（匿名化して送信）"],
                  ].map((row, i) => (
                    <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                      <td style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink)"}}>{row[0]}</td>
                      <td style={{padding:"10px 14px", fontSize:"12px", color:"var(--ink2)"}}>{row[1]}</td>
                      <td style={{padding:"10px 14px", fontSize:"12px", color:"var(--ink3)"}}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              4. データの保持と削除
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              1. アカウント情報は、ユーザーが退会するまで保持します。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              2. 退会時には、アカウントに紐づくすべての個人情報を30日以内に削除します。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              3. 利用データ（アクセスログ等）は、統計的な分析のために匿名化した上で保持する場合があります。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              4. 法令により保存が義務付けられている情報は、所定の期間保持します。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              5. Cookieの使用
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              本サービスでは、ユーザー認証の維持およびサービスの利便性向上のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることが可能ですが、その場合、本サービスの一部機能が正常に動作しない場合があります。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              6. ユーザーの権利
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              ユーザーは、自身の個人情報について以下の権利を有します。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              {[
                { title: "開示請求", desc: "当方が保有する個人情報の開示を請求できます" },
                { title: "訂正請求", desc: "誤った個人情報の訂正を請求できます" },
                { title: "削除請求", desc: "個人情報の削除を請求できます" },
                { title: "利用停止", desc: "個人情報の利用停止を請求できます" },
              ].map((item, i) => (
                <div key={i} style={{display:"flex", gap:"8px", alignItems:"flex-start"}}>
                  <span style={{color:"var(--teal)", fontWeight:700, minWidth:"16px"}}>・</span>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>
                    <strong>{item.title}：</strong>{item.desc}
                  </span>
                </div>
              ))}
            </div>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginTop:"12px"}}>
              これらの請求は、<Link href="/legal/contact" style={{color:"var(--teal)", textDecoration:"none", fontWeight:600}}>お問い合わせフォーム</Link>よりご連絡ください。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              7. お問い合わせ
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
            </p>
            <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                メール：support@pyxislab.co.jp<br/>
                お問い合わせフォーム：<Link href="/legal/contact" style={{color:"var(--teal)", textDecoration:"none"}}>こちら</Link>
              </p>
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              8. ポリシーの変更
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              本プライバシーポリシーは、法令の改正やサービスの変更に伴い、予告なく改定する場合があります。改定後のポリシーは、本サービス上に掲示した時点で効力を生じます。重要な変更がある場合は、登録メールアドレスに通知します。
            </p>
          </section>
        </div>
      </article>

      {/* フッター */}
      <footer style={{background:"var(--premium)", padding:"32px 24px", textAlign:"center"}}>
        <img src="/logo.png" alt="ユニパス" style={{height:"44px", objectFit:"contain", margin:"0 auto 6px", display:"block", filter:"brightness(0) invert(1)"}} />
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
