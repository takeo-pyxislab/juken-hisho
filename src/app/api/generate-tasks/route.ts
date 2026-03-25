import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// 日本語日付テキストから Date を抽出
// 例: "令和8(2026)9月1日" "2026年9月1日" "令和8(2026)年9月14日(月)17時"
function parseJpDate(text: string): Date | null {
  if (!text || text === "no data") return null
  // "(2026)9月1日" パターン
  const m1 = text.match(/\((\d{4})\)(\d{1,2})月(\d{1,2})日/)
  if (m1) return new Date(parseInt(m1[1]), parseInt(m1[2]) - 1, parseInt(m1[3]))
  // "2026年9月1日" パターン
  const m2 = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (m2) return new Date(parseInt(m2[1]), parseInt(m2[2]) - 1, parseInt(m2[3]))
  return null
}

// テキストから最初の有効な日付を取得（複数日程がある場合は最も早い日）
function extractEarliestDate(text: string): Date | null {
  if (!text || text === "no data") return null
  const matches: Date[] = []
  const pattern1 = /\((\d{4})\)(\d{1,2})月(\d{1,2})日/g
  let m
  while ((m = pattern1.exec(text)) !== null) {
    matches.push(new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])))
  }
  const pattern2 = /(\d{4})年(\d{1,2})月(\d{1,2})日/g
  while ((m = pattern2.exec(text)) !== null) {
    matches.push(new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])))
  }
  if (matches.length === 0) return null
  return matches.reduce((earliest, d) => d < earliest ? d : earliest)
}

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

function offsetMonths(base: Date, months: number): string {
  const d = new Date(base)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split("T")[0]
}

export async function POST(req: NextRequest) {
  try {
    const { universities } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "未認証" }, { status: 401 })

    const today = new Date()
    const tasks: object[] = []

    for (const uni of universities) {
      const uniName = uni.university_name
      const facultyName = uni.faculty_name || null
      const deptName = uni.department || null
      const uniId = uni.id

      // universities_db から実際の日程を取得
      let query = supabase
        .from("universities_db")
        .select("application_start, exam_date, result_date, enrollment_deadline")
        .eq("university_name", uniName)

      if (facultyName) query = query.eq("faculty_name", facultyName)
      if (deptName) query = query.eq("department_name", deptName)

      const { data: dbRecords } = await query.limit(5)

      // 複数レコードがある場合は最も早い日程を採用
      let appStartDate: Date | null = null
      let examDate: Date | null = null
      let resultDate: Date | null = null
      let enrollDate: Date | null = null

      if (dbRecords && dbRecords.length > 0) {
        for (const r of dbRecords) {
          const a = extractEarliestDate(r.application_start || "")
          const e = extractEarliestDate(r.exam_date || "")
          const res = extractEarliestDate(r.result_date || "")
          const enr = extractEarliestDate(r.enrollment_deadline || "")
          if (a && (!appStartDate || a < appStartDate)) appStartDate = a
          if (e && (!examDate || e < examDate)) examDate = e
          if (res && (!resultDate || res < resultDate)) resultDate = res
          if (enr && (!enrollDate || enr < enrollDate)) enrollDate = enr
        }
      }

      const hasRealDates = !!(appStartDate || examDate)
      const deptLabel = facultyName ? `${uniName} ${facultyName}${deptName ? ` ${deptName}` : ""}` : uniName

      // 日程ベースのタスク生成
      // 実日程がある場合はそれを使用、ない場合は今日からのオフセット
      const appStart6wBefore = appStartDate
        ? addDays(appStartDate, -42)
        : offsetMonths(today, 1)

      const appStart2wBefore = appStartDate
        ? addDays(appStartDate, -14)
        : offsetMonths(today, 1)

      const appStartDay = appStartDate
        ? addDays(appStartDate, 0)
        : offsetMonths(today, 2)

      const appDeadline1wBefore = appStartDate
        ? addDays(appStartDate, 7)  // 出願開始から1週間後を締切の目安とする
        : offsetMonths(today, 2)

      const exam3wBefore = examDate
        ? addDays(examDate, -21)
        : offsetMonths(today, 3)

      const exam1wBefore = examDate
        ? addDays(examDate, -7)
        : offsetMonths(today, 3)

      tasks.push(
        {
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}の募集要項を確認する`,
          description: hasRealDates
            ? `出願開始${appStartDate ? `（${appStartDate.getFullYear()}年${appStartDate.getMonth()+1}月${appStartDate.getDate()}日〜）` : ""}の6週間前までに出願資格・提出書類・選抜方法を確認する`
            : "出願資格・提出書類・選抜方法を確認する",
          due_date: appStart6wBefore, category: "書類準備"
        },
        {
          user_id: user.id, target_university_id: uniId,
          title: `${uniName}のオープンキャンパスに参加`,
          description: "大学の雰囲気を確認し、志望動機を具体化する",
          due_date: appStart6wBefore, category: "その他"
        },
        {
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}の志望理由書（下書き）を作成`,
          description: "なぜこの大学・学部でなければならないかを800字程度で書く",
          due_date: appStart2wBefore, category: "書類準備"
        },
        {
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}にエントリーシートを提出`,
          description: hasRealDates && appStartDate
            ? `出願開始日（${appStartDate.getFullYear()}年${appStartDate.getMonth()+1}月${appStartDate.getDate()}日）までに提出`
            : "エントリー締切を確認して余裕を持って提出する",
          due_date: appStartDay, category: "エントリー"
        },
        {
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}の出願書類を完成・郵送`,
          description: "書類の不備がないか最終確認してから郵送する",
          due_date: appDeadline1wBefore, category: "出願"
        },
        {
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}の面接対策を強化する`,
          description: hasRealDates && examDate
            ? `試験日（${examDate.getFullYear()}年${examDate.getMonth()+1}月${examDate.getDate()}日）の3週間前から志望動機・自己PRを集中練習`
            : "志望動機・自己PR・学びたいことを整理して練習する",
          due_date: exam3wBefore, category: "試験"
        },
        {
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}の本番直前確認`,
          description: "持ち物・会場・時間を最終確認する",
          due_date: exam1wBefore, category: "試験"
        },
      )

      // 実日程がある場合のみ追加タスク
      if (examDate) {
        tasks.push({
          user_id: user.id, target_university_id: uniId,
          title: `【試験当日】${deptLabel}`,
          description: `試験日：${examDate.getFullYear()}年${examDate.getMonth()+1}月${examDate.getDate()}日`,
          due_date: addDays(examDate, 0), category: "試験"
        })
      }
      if (resultDate) {
        tasks.push({
          user_id: user.id, target_university_id: uniId,
          title: `${deptLabel}の合否確認`,
          description: `結果発表日：${resultDate.getFullYear()}年${resultDate.getMonth()+1}月${resultDate.getDate()}日`,
          due_date: addDays(resultDate, 0), category: "その他"
        })
      }
      if (enrollDate) {
        tasks.push({
          user_id: user.id, target_university_id: uniId,
          title: `【締切】${uniName}の入学手続き`,
          description: `入学手続き締切：${enrollDate.getFullYear()}年${enrollDate.getMonth()+1}月${enrollDate.getDate()}日。入学金・必要書類の提出を忘れずに`,
          due_date: addDays(enrollDate, -3), category: "出願"
        })
      }
    }

    // 既存タスクを削除して新規生成
    await supabase.from("tasks").delete().eq("user_id", user.id)
    await supabase.from("tasks").insert(tasks)

    return NextResponse.json({ success: true, count: tasks.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}
