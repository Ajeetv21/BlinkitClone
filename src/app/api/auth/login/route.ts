import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import connectDb from "@/app/lib/database";

export async function POST(request: Request) {
  try {
    await connectDb()
    const body = await request.json();
    const {email,password} = body;

    const SECRET_KEY = process.env.SECRET_KEY;

    if(!email || !password){
      return NextResponse.json({message:"email and password required"})
    }

    const user = await User.findOne({email})

    if(!user ){
      return NextResponse.json({message:"User not found"},{status:401})
    }

    const isMatch =  await bcrypt.compare(password,user.password)

    if(!isMatch){
      return NextResponse.json({message:"Password is incorrect"})
    }

    if (!SECRET_KEY) {
      return NextResponse.json({ message: "Server error: SECRET_KEY is not defined" }, { status: 500 });
    }

    if(user.role !=="admin" && user.role !=="user"){
     return NextResponse.json({message:"Unauthorized role"},{status:403})
    }
    const token = jwt.sign({ id: user._id , role:user.role}, SECRET_KEY, { expiresIn: "7d" });
     
    if(!token){
      return NextResponse.json({message:"token not created"})
    }

    const response = NextResponse.json({
      message:"Login successfully",
      success:true,
      token,
      user:{
        id : user._id,
        username:user.username,
        email:user.email,
        role:user.role,
      },
   
     
    },{ status:201})

    response.cookies.set('token',token,{httpOnly:true,path:"/"})
     return response;
   
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }  
}