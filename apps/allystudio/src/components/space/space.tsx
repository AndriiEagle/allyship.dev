import { Header } from "@/components/header"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { SpaceProvider } from "./space-context"
import { SpaceDebug } from "./space-debug"
import { SpaceEmpty } from "./space-empty"
import { SpaceOptions } from "./space-options"
import { SpaceSelected } from "./space-selected"

// Root component that sets up the machine and provider
// Use memo to prevent unnecessary re-renders
const Space = memo(function Space({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  return (
    <SpaceProvider>
      <SpaceEmpty />
      <SpaceOptions />
      <SpaceSelected>{children}</SpaceSelected>
      {debug && <SpaceDebug />}
      <Header />
    </SpaceProvider>
  )
})

// Named exports for composite components
export { Space, SpaceEmpty, SpaceOptions, SpaceDebug }
