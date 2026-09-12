import prisma from "@/lib/prisma";
import crypto from "crypto";

export interface AdRewardSession {
  sessionId: string;
  adNetwork: "MOCK_NETWORK" | "GOOGLE_ADMOB" | "UNITY_ADS";
  requiredDurationSeconds: number;
  serviceId: string;
  userId: string;
  createdAt: number;
}

export interface AdVerificationResult {
  success: boolean;
  message: string;
  unlockToken?: string;
  expiresAt?: Date;
}

/**
 * AdProvider Abstraction
 * Allows plug-and-play integration of external Ad Networks (AdSense/AdMob/Rewarded video)
 * without rewriting business entitlement logic.
 */
export interface IAdProvider {
  createSession(userId: string, serviceId: string): Promise<AdRewardSession>;
  verifyCompletion(sessionId: string, clientToken: string): Promise<boolean>;
}

export class MockAdProvider implements IAdProvider {
  async createSession(userId: string, serviceId: string): Promise<AdRewardSession> {
    const sessionId = "ad_sess_" + crypto.randomBytes(16).toString("hex");
    return {
      sessionId,
      adNetwork: "MOCK_NETWORK",
      requiredDurationSeconds: 20,
      serviceId,
      userId,
      createdAt: Date.now(),
    };
  }

  async verifyCompletion(sessionId: string, clientToken: string): Promise<boolean> {
    // In production, this validates HMAC signature or server-to-server webhook from Ad network
    return !!sessionId && !!clientToken && clientToken.startsWith("demo_proof_");
  }
}

export const adProvider = new MockAdProvider();

/**
 * Server-side entitlement checker
 * Ensures frontend state alone cannot bypass the paywall/adwall
 */
export async function verifyUserEntitlement(userId: string, serviceId: string): Promise<{
  hasAccess: boolean;
  reason: "PREMIUM_SUBSCRIBER" | "AD_UNLOCKED" | "NONE";
  expiresAt?: Date;
}> {
  // 1. Check active premium subscription
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      plan: "PREMIUM",
      status: "ACTIVE",
      OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
    },
  });

  if (activeSub) {
    return { hasAccess: true, reason: "PREMIUM_SUBSCRIBER", expiresAt: activeSub.endDate || undefined };
  }

  // 2. Check active ad unlock
  const activeUnlock = await prisma.adUnlock.findFirst({
    where: {
      userId,
      serviceId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "desc" },
  });

  if (activeUnlock) {
    return { hasAccess: true, reason: "AD_UNLOCKED", expiresAt: activeUnlock.expiresAt };
  }

  return { hasAccess: false, reason: "NONE" };
}

/**
 * Grant Ad-based entitlement for 4 hours
 */
export async function grantAdUnlock(userId: string, serviceId: string): Promise<Date> {
  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours access
  const unlockToken = "unl_" + crypto.randomBytes(16).toString("hex");

  await prisma.adUnlock.create({
    data: {
      userId,
      serviceId,
      unlockToken,
      expiresAt,
    },
  });

  return expiresAt;
}
