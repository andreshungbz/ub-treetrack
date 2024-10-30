import { type NextRequest, type NextResponse } from "next/server";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// server component can only get cookies and not set them, hence the "component" check
export function createSupabaseServerClient(component: boolean = false) {
  const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies);
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        setAll(cookiesToSet) {
          if (component) return;
          cookiesToSet.forEach(async ({ name, value, options }) =>
            (await cookieStore).set(name, value, options),
          );
        },
      },
    },
  );
}

export async function createSupabaseServerComponentClient() {
  (await cookies()).getAll();
  return createSupabaseServerClient(true);
}

export async function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse,
) {
  (await cookies()).getAll();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );
}
