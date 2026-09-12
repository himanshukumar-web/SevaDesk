import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      role = "USER",
      state,
      district,
      city,
      pincode,
      // Cyber cafe specific fields
      shopName,
      address,
      servicesOffered,
    } = body;

    // Server-side validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Name, email, mobile number, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const emailNorm = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const validRole = role === "CYBER_CAFE" ? "CYBER_CAFE" : "USER";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailNorm,
        phone: phone.trim(),
        passwordHash,
        role: validRole,
        state: state || null,
        district: district || null,
        city: city || null,
        pincode: pincode || null,
        isVerified: true,
        ...(validRole === "CYBER_CAFE"
          ? {
              cyberCafe: {
                create: {
                  shopName: shopName || `${name.trim()}'s Digital Seva Kendra`,
                  ownerName: name.trim(),
                  phone: phone.trim(),
                  email: emailNorm,
                  address: address || "Local Market",
                  city: city || "City",
                  district: district || "District",
                  state: state || "State",
                  pincode: pincode || "000000",
                  servicesOffered: servicesOffered || "Document Typing, Online Applications, Printing, Scanning",
                  verificationStatus: "PENDING",
                },
              },
            }
          : {}),
      },
      include: {
        cyberCafe: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as "USER" | "CYBER_CAFE" | "SUPER_ADMIN",
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cyberCafe: user.cyberCafe,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
