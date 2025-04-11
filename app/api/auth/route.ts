import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const {token} = await req.json();
    if (token) {
        cookies().set('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24,
        });
        return NextResponse.json({status: 'success'});
    }
    return NextResponse.json({status: 'error'});
}