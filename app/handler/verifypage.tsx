import { app } from "@/firebase";
import { School } from "@mui/icons-material";
import { applyActionCode, getAuth } from "firebase/auth";
import { Albert_Sans } from "next/font/google";
import { useState } from "react";

const albert = Albert_Sans({ subsets: ["latin"] });

function useQuery() {
  return new URLSearchParams(window.location.search);
}

export default function VerifyEmail() {
    const query = useQuery();
    const oobCode = query.get('oobCode')!;
    const [verified, setVerified] = useState(false);
    const auth = getAuth(app);

    applyActionCode(auth, oobCode).then((email) => {
        console.log(email);
        setVerified(true);
    }).catch((error) => {
        location.href = '/login';
    })
    
    return (
        
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
        <div className="absolute hidden md:block bottom-0 right-0 bg-[url('/loginBg.svg')] h-screen w-screen bg-right-bottom z-0 bg-no-repeat"></div>
        <div className="bg-white rounded-md p-8 lg:ml-32 space-y-4 text-center w-[33rem] z-20">
            <School className="text-5xl text-study-orange" />
            {verified ? <>
            <h1 className={"text-4xl font-semibold "+albert.className}>Email Verified</h1>
            <p className="text-sm">Your email has been verified. You can now login.</p>
            <p className="text-sm"><a className="font-medium text-study-orange" href="/login">Go to login -&gt;</a></p>
            </> : <>
            <h1 className={"text-4xl font-semibold "+albert.className}>Verifying email</h1>
            <p className="text-sm">Please wait while we verify your email.</p>
            </>}
        </div>
    </main>
    )
}