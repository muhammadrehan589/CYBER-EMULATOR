import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

// GET /api/activity-logs - Fetch logs, optionally filtered by empId
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const empId = searchParams.get('empId');

    const filter: Record<string, any> = {};
    if (empId) {
      filter.empId = empId;
    }

    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error('[API] GET /api/activity-logs error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/activity-logs - Create a new log entry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { empId, action, type, details } = body;

    const log = await ActivityLog.create({
      empId,
      action,
      type,
      details,
    });

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/activity-logs error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
