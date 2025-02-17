import { notFound } from "next/navigation"
import { AddPageDialog } from "@/features/pages/components/add-page-dialog"
import { CrawlButton } from "@/features/pages/components/crawl-button"
import { PagesIndex } from "@/features/pages/components/pages-index"
import { PageHeader } from "@/features/websites/components/page-header"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { website_id: string; space_id: string }
}

export default async function PagesPage({ params }: Props) {
  const { website_id, space_id } = params
  const supabase = await createClient()

  const { data } = await supabase
    .from("Page")
    .select()
    .eq("id", website_id)
    .order("url")

  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Manage pages">
        <div className="flex items-center gap-2">
          {/* <CrawlButton website_id={website_id} website_url={website_url} />*/}
          {/* <AddPageDialog space_id={space_id} website_id={website_id} /> */}
        </div>
      </PageHeader>

      <div className="container space-y-6">
        <PagesIndex space_id={space_id} website_id={website_id} pages={data} />
      </div>
    </div>
  )
}
