import { NextResponse } from "next/server";
import connectDb from "../../../lib/database"
import   User   from '../../../../models/User';
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        await connectDb();

        const body = await request.json();

        const { username, email, password, role = "user" } = body;

        if (!username||!email||!password) {
            return NextResponse.json({ result: "All field required", success: false }, { status: 201 })
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const existingUser = User.findOne({email:email})
        if(!existingUser){
           return NextResponse.json({result:"user already register"})
        }


        const user = await User.create({ username, email, password:hashedPassword, role });

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });

    } catch (error) {

        console.log(error)

    }
}