import { NextRequest, NextResponse, NextMiddleware } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PUBLIC_PATHS = [ '/login', '/forgot', '/signup', '/api/auth', '/handler' ];

export const middleware: NextMiddleware = async (req: NextRequest) => {

    const nexturl = req.nextUrl.clone()
    
    const url = new URL(req.url)?.pathname;

    const token = cookies().get('token');
    console.log(url);
    // if (!token && !PUBLIC_PATHS.includes(url)) {
    //     console.log('redirecting to login');
    //     nexturl.pathname = '/login';
    //     return NextResponse.redirect(nexturl.toString());
    // }
    // if (token && PUBLIC_PATHS.includes(url)) {
    //     console.log('redirecting to home');
    //     nexturl.pathname = '/';
    //     return NextResponse.redirect(nexturl.toString());
    // }
    return NextResponse.next();
};

export const config = {
    matcher: [
        "/",
        "/((?!_next|api|.*\\.).*)",
        "/api/auth",
    ]   
}