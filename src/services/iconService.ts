import type { IconKey } from '@/ui/icon-presets'
import { ICON_COMPONENTS } from '@/ui/icon-presets'

export function getIconComponent(iconKey?: IconKey | null) {
  if (!iconKey) return undefined
  return ICON_COMPONENTS[iconKey]
}

export function isValidIconKey(key: string | undefined | null): key is IconKey {
  return !!key && (key in ICON_COMPONENTS)
}

