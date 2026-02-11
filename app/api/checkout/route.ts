import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

async function createCheckoutSession(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const origin = request.headers.get('origin') || new URL(request.url).origin

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [
      {
        price: 'price_1Sx73QC6OuHgfoYHw5V6L6af', // CEO Lab Premium - €100/month
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: `${origin}/ceolab?success=true`,
    cancel_url: `${origin}/ceolab?canceled=true`,
    metadata: {
      user_id: user.id,
    },
  })

  return session
}

// GET — browser navigation (e.g. <a href="/api/checkout">)
export async function GET(request: Request) {
  try {
    const session = await createCheckoutSession(request)
    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    return NextResponse.redirect(session.url!)
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.redirect(new URL('/ceolab?error=checkout', request.url))
  }
}

// POST — fetch() calls
export async function POST(request: Request) {
  try {
    const session = await createCheckoutSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
