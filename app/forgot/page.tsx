"use client";
import { Albert_Sans } from "next/font/google";
import { School } from "@mui/icons-material";
import { TextField, Button, ThemeProvider, } from "@mui/material";
import config from "@/tailwind.config";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import { app } from "@/firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const tailwindConfig = config as any;
const studyOrange = tailwindConfig.theme.extend.colors["study-orange"];

const albert = Albert_Sans({ subsets: ["latin"] });

export default function Home() {

  const auth = getAuth(app);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [mail, setMail] = useState('');

  const handleReset = (e:any) => {
    e.preventDefault();
    const email = e.target.email.value;
    sendPasswordResetEmail(auth, email).then(() => {
      setSent(true);
      setMail(email);
    }).catch((error) => {
      setError("An error occurred. Please try again later.");
    });
  }

  const handleResend = (e:any) => {
    sendPasswordResetEmail(auth, mail).then(() => {
      setError('');
    }).catch((error) => {
      setError("An error occurred. Please try again later.");
    });
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: studyOrange
      },
    },
  });
  return (
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
        <div className="absolute hidden md:block bottom-0 right-0 bg-[url('/loginBg.svg')] h-screen w-screen bg-right-bottom z-0 bg-no-repeat"></div>
        <div className="bg-white rounded-md p-8 lg:ml-32 space-y-4 text-center w-[33rem] z-20">
            <School className="text-5xl text-study-orange" />
            {sent ? <>
            <h1 className={"text-4xl font-semibold "+albert.className}>Check your email</h1>
            <p className="text-sm">We sent a password reset link to your email. <br />Please check your inbox.</p>
            <ThemeProvider theme={theme}>
              <Button variant="contained" className="normal-case" disableElevation target="_blank" fullWidth href="https://mail.google.com/mail/u/0/">Open Gmail</Button>
            </ThemeProvider>
            <p className="text-sm">Didn&apos;t receive the email? <a onClick={handleResend} className="font-medium text-study-orange cursor-pointer">Resend</a></p>
            <p className="text-sm"><a className="font-medium text-study-orange" href="/login">&lt;- Go back to login</a></p>
            </> : <>
            <h1 className={"text-4xl font-semibold "+albert.className}>Forgot password?</h1>
            <p className="text-sm">No problem, we&apos;ll send you reset instructions.</p>
            <form onSubmit={handleReset} className="space-y-3">
              <ThemeProvider theme={theme}>
                <div className="text-left space-y-1">
                  <label htmlFor="email" className="font-medium text-sm">Email</label>
                  <TextField id="email" type="email" placeholder="example@gmail.com" required size="small" variant="outlined" hiddenLabel fullWidth />
                </div>
                <Button variant="contained" className="normal-case" type="submit" disableElevation fullWidth>Submit</Button>
              </ThemeProvider>
            </form>
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-sm"><a className="font-medium text-study-orange" href="/login">&lt;- Go back to login</a></p>
            </>}
        </div>
    </main>
  );
}
