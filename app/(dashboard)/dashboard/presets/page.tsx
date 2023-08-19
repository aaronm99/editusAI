import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"

import { PresetModal } from "@/components/preset-modal"
import { PresetItem } from "@/components/preset-item"

export const metadata = {
  title: "Dashboard",
}

export default async function PresetPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const presets = await db.preset.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      templates: {
        select: {
          id: true,
          updatedAt: true,
          createdAt: true,
          config: true,
          bucket: true,
          key: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <>
      <DashboardHeader heading="Presets" text="Create and manage your presets.">
        <PresetModal />
      </DashboardHeader>
      <div className="mt-8">
        {presets?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {presets.map((preset) => (
              <PresetItem key={preset.id} preset={preset} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="video" />
            <EmptyPlaceholder.Title>No presets created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any presets yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PresetModal />
          </EmptyPlaceholder>
        )}
      </div>
    </>
  )
}
