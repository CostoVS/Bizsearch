import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/serverDb";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminSession(req);
  if (!isAuthorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const db = readDb();
  // Sort logs by newest first
  const logs = (db.moderationLogs || []).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return NextResponse.json({ success: true, logs });
}
