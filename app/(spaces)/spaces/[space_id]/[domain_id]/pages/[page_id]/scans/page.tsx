import { ScanJobCreate } from "@/features/scans/components/scan-create"
import { ScanIndex } from "@/features/scans/components/scan-index"

import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"

type Props = {
  params: { space_id: string; domain_id: string; page_id: string }
}

export default async function ScansPage({ params }: Props) {
  const { page_id } = params
  const supabase = await createClient()

  const { data } = await supabase
    .from("Scan")
    .select("id, url, status, created_at, page_id, results, user_id")
    .eq("page_id", page_id)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <PageHeader heading="Page Scans" />
      <div className="space-y-8">
        <ScanJobCreate pageId={page_id} variant="admin" />
        <ScanIndex scans={data ?? []} />
      </div>
    </div>
  )
}
