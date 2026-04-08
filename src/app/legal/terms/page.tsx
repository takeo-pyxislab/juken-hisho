import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "利用規約 | ユニパス",
  description: "ユニパス（総合型選抜ナビ）の利用規約です。サービスの利用条件・禁止事項・免責事項などをご確認ください。",
}

export default function TermsPage() {
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
          <span>利用規約</span>
        </div>

        <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"12px"}}>
          利用規約
        </h1>
        <p style={{fontSize:"13px", color:"var(--ink3)", marginBottom:"40px"}}>最終更新日：2026年4月1日</p>

        <div style={{display:"flex", flexDirection:"column", gap:"40px"}}>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第1条（適用）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              本利用規約（以下「本規約」）は、株式会社Pyxis Lab（以下「当社」）が運営するユニパス（以下「本サービス」）の利用に関する条件を定めるものです。本サービスを利用するすべてのユーザー（以下「ユーザー」）は、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第2条（サービスの内容）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              本サービスは、総合型選抜（旧AO入試）を中心とした大学入試に関する情報比較ツールです。522大学・7,980学科の情報をもとに、以下の機能を提供します。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"8px", marginBottom:"12px"}}>
              {[
                "大学の費用（受験料・入学金・授業料）の比較シミュレーション",
                "出願・試験・合格発表の日程比較",
                "併願可否（専願・併願）の確認",
                "AI診断によるマッチング提案（プレミアムプラン）",
                "タスク管理・志望理由書サポート（プレミアムプラン）",
                "保護者向けレポート出力（プレミアムプラン）",
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
              第3条（アカウント登録）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              1. シミュレーター機能は登録不要で利用できます。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              2. プレミアム機能を利用する場合は、メールアドレスによるアカウント登録が必要です。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              3. ユーザーは、登録情報を正確かつ最新の状態に保つ義務を負います。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              4. アカウントの管理責任はユーザーにあり、第三者による不正利用について当方は責任を負いません。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第4条（料金・プラン）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              1. 本サービスには無料プランとプレミアムプラン（月額980円・税込）があります。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              2. プレミアムプランの決済はStripeを通じて処理されます。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              3. プレミアムプランは月単位での自動更新となり、解約しない限り毎月課金されます。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              4. 解約はマイページからいつでも可能です。解約後も当月末まではプレミアム機能を利用できます。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第5条（禁止事項）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              ユーザーは、以下の行為を行ってはなりません。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              {[
                "本サービスのデータを無断で複製・転載・販売する行為",
                "不正アクセス、サーバーへの過度な負荷を与える行為",
                "他のユーザーになりすます行為",
                "本サービスの運営を妨害する行為",
                "AI機能を利用して生成したコンテンツを、自己の作成物として大学に提出する行為",
                "法令または公序良俗に反する行為",
                "その他、当方が不適切と判断する行為",
              ].map((item, i) => (
                <div key={i} style={{display:"flex", gap:"8px", alignItems:"flex-start"}}>
                  <span style={{color:"#e11d48", fontWeight:700, minWidth:"16px"}}>・</span>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第6条（知的財産権）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              本サービスに掲載されるコンテンツ（文章、デザイン、プログラム、データベース構造等）に関する知的財産権は、当方または正当な権利者に帰属します。ユーザーは、私的利用の範囲を超えてこれらを使用することはできません。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第7条（免責事項）
            </h2>
            <div style={{background:"rgba(225,29,72,.05)", border:"1.5px solid rgba(225,29,72,.15)", borderRadius:"12px", padding:"16px 20px", marginBottom:"16px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>重要</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                本サービスが提供する大学情報・AI診断結果は参考情報であり、その正確性・最新性・完全性を保証するものではありません。最新の正確な情報は、必ず各大学の公式サイトおよび募集要項でご確認ください。
              </p>
            </div>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              1. 本サービスの利用により生じたいかなる損害（出願ミス、日程の見落とし、費用の相違、不合格等を含みますがこれに限りません）についても、当方は責任を負いません。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              2. AI機能による提案・診断は参考情報であり、専門的な教育相談・進路指導の代替とはなりません。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              3. 詳細については<Link href="/legal/disclaimer" style={{color:"var(--teal)", textDecoration:"none", fontWeight:600}}>免責事項</Link>ページもあわせてご確認ください。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第8条（サービスの変更・停止・終了）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              1. 当方は、事前の通知なく本サービスの内容を変更し、または一時的に停止することがあります。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              2. サービスの終了を行う場合は、可能な限り事前にユーザーに通知します。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              3. サービスの変更・停止・終了によりユーザーに生じた損害について、当方は責任を負いません。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第9条（規約の変更）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              当方は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲示した時点で効力を生じます。変更後に本サービスを利用した場合、変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              第10条（準拠法・管轄）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              本規約は日本法に準拠し、本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>
        </div>
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
