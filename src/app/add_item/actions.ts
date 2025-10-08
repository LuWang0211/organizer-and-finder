'use server'

import { z } from 'zod'
import { createItem } from '@/services/itemService'
import { getSession } from '@/auth'

// Validation schema
const addItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  locationId: z.string().optional(),
  icon: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be positive').min(1, 'Quantity must be at least 1').default(1)
})

type ActionResult = { ok: true } | { ok: false; error: string }

export async function addItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // Session validation
  const session = await getSession()
  if (!session?.dbUser?.familyId) {
    return { ok: false as const, error: 'Unauthorized. Please log in.' }
  }

  // Parse and validate input
  const qtyRaw = formData.get('quantity')?.toString() ?? formData.get('__qty_fallback')?.toString()
  const parsedQuantity = parseInt(qtyRaw || '1', 10)

  const validationResult = addItemSchema.safeParse({
    name: formData.get('name')?.toString().trim(),
    locationId: formData.get('locationId')?.toString().trim() || undefined,
    icon: formData.get('icon')?.toString().trim() || undefined,
    quantity: Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1
  })

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0]
    return { ok: false as const, error: firstError.message }
  }

  const { name, locationId, icon, quantity } = validationResult.data

  try {
    await createItem(name, {
      locationId: locationId || undefined,
      icon: (icon as any) || undefined,
      quantity
    })
    return { ok: true as const }
  } catch (e: any) {
    console.error('Error creating item:', e)

    // Provide user-friendly error messages
    if (e?.code === 'P2002') {
      return { ok: false as const, error: 'An item with this name already exists.' }
    }

    const reason = (e?.message as string) || 'Failed to create item. Please try again.'
    return { ok: false as const, error: reason }
  }
}
