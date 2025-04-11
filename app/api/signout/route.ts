import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase";

export async function GET(req: NextRequest) {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
        signOut(auth);
    }
    cookies().delete('token');
    return NextResponse.json({status: 'success'});
}