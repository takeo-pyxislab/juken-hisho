import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "免責事項 | ユニパス",
  description: "ユニパス（総合型選抜ナビ）の免責事項です。大学情報・AI診断の取り扱い、利用上の注意事項をご確認ください。",
}

export default function DisclaimerPage() {
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
          <span>免責事項</span>
        </div>

        <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"12px"}}>
          免責事項
        </h1>
        <p style={{fontSize:"13px", color:"var(--ink3)", marginBottom:"24px"}}>最終更新日：2026年4月1日</p>

        {/* 重要な注意書き */}
        <div style={{background:"rgba(225,29,72,.05)", border:"2px solid rgba(225,29,72,.2)", borderRadius:"14px", padding:"24px", marginBottom:"40px"}}>
          <div style={{fontSize:"15px", fontWeight:700, color:"#e11d48", marginBottom:"12px"}}>必ずお読みください</div>
          <p style={{fontSize:"14px", color:"var(--ink)", lineHeight:2, margin:0, fontWeight:500}}>
            本サービス（ユニパス）が提供する大学情報・AI診断結果・シミュレーション結果はすべて<strong>参考情報</strong>です。出願や受験に関する最終的な判断は、<strong>必ず各大学の公式サイトおよび募集要項で最新情報を確認</strong>した上で、ご自身の責任で行ってください。
          </p>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:"40px"}}>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              1. 大学情報の正確性について
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              本サービスに掲載している大学情報（522大学・7,980学科）は、各大学の公開情報をもとに作成していますが、以下の点をご了承ください。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {[
                {
                  title: "情報が古い場合があります",
                  desc: "大学が募集要項を変更した場合、本サービスへの反映にタイムラグが生じることがあります。特に年度切り替え時期（毎年3〜6月）はご注意ください。"
                },
                {
                  title: "誤りが含まれる場合があります",
                  desc: "データ入力や変換処理の過程で誤りが混入する可能性があります。情報の正確性を保証するものではありません。"
                },
                {
                  title: "すべての情報を網羅していません",
                  desc: "募集要項の詳細条件、特別選考、追加募集など、本サービスに掲載されていない情報が存在します。"
                },
              ].map((item, i) => (
                <div key={i} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                  <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>{item.title}</div>
                  <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              2. 専願・併願情報について
            </h2>
            <div style={{background:"rgba(225,29,72,.05)", border:"1.5px solid rgba(225,29,72,.15)", borderRadius:"12px", padding:"16px 20px", marginBottom:"16px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>特に重要</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                専願（合格した場合に入学が条件）か併願可能かの情報は、受験戦略において極めて重要です。本サービスの専願・併願表示はあくまで参考であり、<strong>必ず各大学の最新の募集要項で直接ご確認ください。</strong>
              </p>
            </div>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              専願・併願の判定は大学ごとに異なり、同じ大学でも学部・学科・選考方式によって異なる場合があります。また、年度によって変更される場合もあります。専願条件を見落として併願で出願した場合など、本サービスの表示に基づいた判断によって生じた損害について、当方は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              3. 費用情報について
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"12px"}}>
              本サービスが表示する費用情報（受験料・入学金・授業料等）は概算であり、以下の点にご注意ください。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              {[
                "各大学が費用を改定した場合、即座に反映されない場合があります",
                "施設費、実験実習費、諸会費など、表示に含まれていない費用が存在する場合があります",
                "奨学金や減免制度は考慮されていません",
                "為替レートの変動により、留学関連費用は大きく変動する可能性があります",
              ].map((item, i) => (
                <div key={i} style={{display:"flex", gap:"8px", alignItems:"flex-start"}}>
                  <span style={{color:"var(--ink3)", fontWeight:700, minWidth:"16px"}}>・</span>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              4. 日程・スケジュール情報について
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              出願期間・試験日・合格発表日などの日程情報は、各大学の発表時点の情報に基づいています。自然災害・感染症・大学の都合等により日程が変更される場合があり、本サービスの表示が最新の日程を反映していない可能性があります。<strong>出願締切日を本サービスの表示のみに頼って判断しないでください。</strong>日程の見落としや勘違いにより出願機会を逃した場合でも、当方は責任を負いません。
            </p>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              5. AI診断・AI機能について
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              本サービスのAI機能（マッチング診断、志望理由書サポート等）について、以下をご理解ください。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {[
                {
                  title: "専門的な進路指導の代替ではありません",
                  desc: "AI診断の結果は、入力されたプロフィール情報に基づく統計的な参考情報です。専門的な教育相談や進路指導が必要な場合は、学校の進路指導担当者や専門家にご相談ください。"
                },
                {
                  title: "合格を保証するものではありません",
                  desc: "AIが提案する大学・学部が合格しやすいことを意味するものではありません。本サービスは大学合格を保証するものではなく、いかなる場合も合否に関する責任を負いません。"
                },
                {
                  title: "AI生成コンテンツの取り扱い",
                  desc: "志望理由書サポート機能等で生成された文章は、あくまで下書き・参考です。AIが生成した文章をそのまま大学の出願書類として提出することは、多くの大学で不正行為とみなされる可能性があります。必ずご自身の言葉で書き直してください。"
                },
              ].map((item, i) => (
                <div key={i} style={{background: i === 2 ? "rgba(225,29,72,.05)" : "var(--surface)", border: i === 2 ? "1.5px solid rgba(225,29,72,.15)" : "1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                  <div style={{fontSize:"14px", fontWeight:700, color: i === 2 ? "#e11d48" : "var(--ink)", marginBottom:"6px"}}>{item.title}</div>
                  <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              6. 損害に関する免責
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              本サービスの利用に起因または関連して生じたいかなる損害についても、当方は一切の責任を負いません。損害には以下を含みますが、これに限りません。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              {[
                "出願締切の見落としによる出願機会の喪失",
                "費用見積もりの相違による予算計画の変更",
                "専願・併願の誤認による出願トラブル",
                "AI診断結果に基づく進路選択による不利益",
                "志望理由書サポート機能の利用に関するトラブル",
                "サービスの停止・障害による情報へのアクセス不能",
                "その他、本サービスの利用に関連して生じた直接的・間接的損害",
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
              7. 推奨される利用方法
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              本サービスを安全にご利用いただくために、以下を推奨します。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {[
                {icon:"1", text:"本サービスで気になる大学を整理・比較する"},
                {icon:"2", text:"各大学の公式サイトで最新の募集要項を必ず確認する"},
                {icon:"3", text:"専願・併願条件は必ず募集要項の原文で確認する"},
                {icon:"4", text:"重要な日程は複数の情報源で確認し、余裕を持って行動する"},
                {icon:"5", text:"AI診断結果は参考にしつつ、学校の先生や保護者とも相談する"},
              ].map((item, i) => (
                <div key={i} style={{display:"flex", gap:"14px", alignItems:"flex-start", padding:"12px 16px", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"10px"}}>
                  <div style={{
                    width:"28px", height:"28px", minWidth:"28px", borderRadius:"50%",
                    background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"12px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>{item.icon}</div>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, paddingTop:"3px"}}>{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"12px", paddingBottom:"8px", borderBottom:"2px solid var(--teal)"}}>
              8. お問い合わせ
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              本免責事項に関するご質問や、掲載情報の誤りに関するご報告は、<Link href="/legal/contact" style={{color:"var(--teal)", textDecoration:"none", fontWeight:600}}>お問い合わせフォーム</Link>よりご連絡ください。情報の誤りについては、確認の上、速やかに修正対応いたします。
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
