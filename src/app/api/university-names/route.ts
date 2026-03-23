import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("keyword") || ""
    const prefecture = searchParams.get("prefecture") || ""
    const category = searchParams.get("category") || ""
    const kyotsuu = searchParams.get("kyotsuu") || ""
    const app_type = searchParams.get("app_type") || ""

    let query = supabase
      .from("universities_db")
      .select("university_name, faculty_category, application_type, prefecture")

    if (keyword) query = query.or(`university_name.ilike.%${keyword}%,faculty_name.ilike.%${keyword}%`)
    if (prefecture) query = query.eq("prefecture", prefecture)
    if (category) query = query.eq("faculty_category", category)
    if (kyotsuu) query = query.eq("has_kyotsuu", kyotsuu)
    if (app_type) query = query.eq("application_type", app_type)

    const { data, error } = await query.order("university_name").limit(200)
    if (error) throw error

    // 大学名でグループ化
    const map: Record<string, { cats: Set<string>, hasHeigan: boolean, hasSengan: boolean }> = {}
    for (const r of (data || [])) {
      if (!map[r.university_name]) map[r.university_name] = { cats: new Set(), hasHeigan: false, hasSengan: false }
      if (r.faculty_category && r.faculty_category !== "no data") map[r.university_name].cats.add(r.faculty_category)
      if (r.application_type === "併願") map[r.university_name].hasHeigan = true
      if (r.application_type === "専願") map[r.university_name].hasSengan = true
    }

    const result = Object.entries(map).map(([name, v]) => ({
      name,
      cats: [...v.cats].slice(0, 2),
      hasHeigan: v.hasHeigan,
      hasSengan: v.hasSengan,
    }))

    return NextResponse.json({ data: result, count: result.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}
