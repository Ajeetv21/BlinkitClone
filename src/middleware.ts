import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: Request) {
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!SECRET_KEY) {
        console.error("SECRET_KEY is not defined in environment variables.");
        return NextResponse.json({ message: "Server error: SECRET_KEY is not defined" }, { status: 500 });
    }

    const token = request.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    const path = new URL(request.url).pathname;

    const isPublicPath = path === "/login" || path === "/signup" || path === "/";

    if (!token) {
        if (!isPublicPath) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    try {
        const decodedToken = await jwtVerify(
            token,
            new TextEncoder().encode(SECRET_KEY)
        );

        const { payload } = decodedToken;

        if (isPublicPath) {
          
            if (payload.role === "admin") {
                return NextResponse.redirect(new URL("/admindashboard", request.url));
            } else if (payload.role === "user") {
                return NextResponse.redirect(new URL("/customerdashboard", request.url));
            }
        }

        if (path.startsWith("/admindashboard") && payload.role !== "admin") {
            return NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 });
        }

        if (path.startsWith("/customerdashboard") && payload.role !== "user") {
            return NextResponse.json({ message: "Access denied: Users only" }, { status: 403 });
        }
        if (path.startsWith("/category") && payload.role !== "admin") {
            return NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 });
        }
        if (path.startsWith("/subcategory") && payload.role !== "admin") {
            return NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 });
        }
        if (path.startsWith("/product") && payload.role !== "admin") {
            return NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 });
        }
        if (path.startsWith("/profile") && payload.role !== "admin") {
            return NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 });
        }
        if (path.startsWith("/setting") && payload.role !== "admin") {
            return NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 });
        }
        

        return NextResponse.next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/admindashboard/:path*","/category/:path*","/subcategory","/product","/profile",
        "/setting", "/customerdashboard/:path*", "/login", "/signup",],
};
