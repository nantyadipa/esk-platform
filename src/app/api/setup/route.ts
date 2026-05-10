import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  const results: string[] = []

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const b1 = await supabase.storage.createBucket('company-images', { public: true })
    results.push('company-images: ' + (b1.error?.message || 'OK'))
    const b2 = await supabase.storage.createBucket('testimonial-photos', { public: true })
    results.push('testimonial-photos: ' + (b2.error?.message || 'OK'))
  } catch (e) {
    results.push('Storage error: ' + (e as Error).message)
  }

  try {
    const policyNames = [
      '"Public Select company-images"',
      '"Public Select testimonial-photos"',
      '"Auth Insert company-images"',
      '"Auth Insert testimonial-photos"',
      '"Auth Delete company-images"',
      '"Auth Delete testimonial-photos"',
    ]
    const policyDefs = [
      `FOR SELECT USING (bucket_id = 'company-images')`,
      `FOR SELECT USING (bucket_id = 'testimonial-photos')`,
      `FOR INSERT WITH CHECK (bucket_id = 'company-images')`,
      `FOR INSERT WITH CHECK (bucket_id = 'testimonial-photos')`,
      `FOR DELETE USING (bucket_id = 'company-images')`,
      `FOR DELETE USING (bucket_id = 'testimonial-photos')`,
    ]
    for (let i = 0; i < policyNames.length; i++) {
      try {
        await db.execute(sql.raw(`CREATE POLICY ${policyNames[i]} ON storage.objects ${policyDefs[i]}`))
      } catch {
        // policy already exists
      }
    }
    results.push('RLS policies: OK')
  } catch (e) {
    results.push('RLS error: ' + (e as Error).message)
  }

  return NextResponse.json({ results })
}
