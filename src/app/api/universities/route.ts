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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 1000)

    let query = supabase
      .from("universities_db")
      .select("*", { count: "exact" })

    if (keyword) {
      query = query.or(`university_name.ilike.%${keyword}%,faculty_name.ilike.%${keyword}%,department_name.ilike.%${keyword}%`)
    }
    if (prefecture) query = query.eq("prefecture", prefecture)
    if (category) query = query.eq("faculty_category", category)
    if (kyotsuu) query = query.eq("has_kyotsuu", kyotsuu)
    if (app_type) query = query.eq("application_type", app_type)

    const { data, count, error } = await query
      .order("university_name")
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return NextResponse.json({ data, count, page, limit })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}
