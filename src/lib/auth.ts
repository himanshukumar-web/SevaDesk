import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const AUTH_COOKIE_NAME = "sevadesk_auth_token";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "USER" | "CYBER_CAFE" | "SUPER_ADMIN";
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Retrieves the currently authenticated user profile from Supabase Auth and Prisma database.
 * Supabase Auth manages identity and security tokens;
 * Prisma PostgreSQL stores application profile, cyber cafe status, and subscriptions.
 */
export async function getCurrentUser() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 1. Check Supabase Auth session via server cookies
    if (supabase) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser && authUser.email) {
        const normalizedEmail = authUser.email.toLowerCase().trim();

        // Query application profile by Supabase Auth UID or email
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { supabaseAuthId: authUser.id },
              { email: normalizedEmail },
            ],
          },
          select: {
            id: true,
            supabaseAuthId: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            avatarUrl: true,
            state: true,
            district: true,
            city: true,
            pincode: true,
            isVerified: true,
            cyberCafe: {
              select: {
                id: true,
                shopName: true,
                verificationStatus: true,
                isAvailable: true,
                rating: true,
              },
            },
            subscriptions: {
              where: { status: "ACTIVE" },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        // If user exists by email but doesn't have supabaseAuthId linked, link it now
        if (user && !user.supabaseAuthId) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { supabaseAuthId: authUser.id },
            });
            user.supabaseAuthId = authUser.id;
          } catch (linkErr) {
            console.warn("[Auth] Could not link supabaseAuthId:", linkErr);
          }
        }

        // If user doesn't exist in Prisma database yet (e.g. direct Supabase signup), auto-provision profile
        if (!user) {
          try {
            const meta = authUser.user_metadata || {};
            const role =
              meta.role === "CYBER_CAFE"
                ? "CYBER_CAFE"
                : meta.role === "SUPER_ADMIN"
                ? "SUPER_ADMIN"
                : "USER";

            user = await prisma.user.create({
              data: {
                supabaseAuthId: authUser.id,
                email: normalizedEmail,
                name: meta.name || normalizedEmail.split("@")[0],
                phone: meta.phone || "",
                role,
                isVerified: true,
              },
              select: {
                id: true,
                supabaseAuthId: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                avatarUrl: true,
                state: true,
                district: true,
                city: true,
                pincode: true,
                isVerified: true,
                cyberCafe: {
                  select: {
                    id: true,
                    shopName: true,
                    verificationStatus: true,
                    isAvailable: true,
                    rating: true,
                  },
                },
                subscriptions: {
                  where: { status: "ACTIVE" },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            });
          } catch (createErr) {
            console.error("[Auth] Could not provision user profile from Supabase Auth:", createErr);
          }
        }

        if (user) {
          return user;
        }
      }
    }

    // 2. Fallback check for local development session cookie if Supabase credentials are unset
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      const user = await prisma.user.findFirst({
        where: { id: token },
        select: {
          id: true,
          supabaseAuthId: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          avatarUrl: true,
          state: true,
          district: true,
          city: true,
          pincode: true,
          isVerified: true,
          cyberCafe: {
            select: {
              id: true,
              shopName: true,
              verificationStatus: true,
              isAvailable: true,
              rating: true,
            },
          },
          subscriptions: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
      if (user) return user;
    }

    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
