import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserService } from '@/services/UserService';
import { MongoUserRepository } from '@/repositories/MongoUserRepository';

// Initialize the service with the concrete repository (Dependency Injection)
const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);

// GET /api/users - Fetch users with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const users = await userService.getUsers(department, search, status);

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('[API] GET /api/users error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const safeUser = await userService.createUser(body);

    return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/users error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'User with this empId or username already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/users - Update a user (status toggle, score, avatar, etc.)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { empId, updates, inc } = body;

    const updatedUser = await userService.updateUser(empId, updates, inc);

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error('[API] PATCH /api/users error:', error);
    const status = error.message === 'User not found.' || error.message.includes('required') ? 400 : 500;
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status }
    );
  }
}
