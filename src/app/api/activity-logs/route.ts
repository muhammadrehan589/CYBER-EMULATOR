import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ActivityLogService } from '@/services/ActivityLogService';
import { MongoActivityLogRepository } from '@/repositories/MongoActivityLogRepository';

const activityLogRepository = new MongoActivityLogRepository();
const activityLogService = new ActivityLogService(activityLogRepository);

// GET /api/activity-logs - Fetch logs, optionally filtered by empId
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const empId = searchParams.get('empId');

    const logs = await activityLogService.getLogs(empId);

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
    const log = await activityLogService.createLog(body);

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/activity-logs error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
