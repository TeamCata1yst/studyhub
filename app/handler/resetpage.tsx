"use client";
import { Albert_Sans } from "next/font/google";
import { School, Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, ThemeProvider, Alert, InputAdornment } from "@mui/material";
import config from "@/tailwind.config";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import { app } from "@/firebase";
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

const tailwindConfig = config as any;
const studyOrange = tailwindConfig.theme.extend.colors["study-orange"];

const albert = Albert_Sans({ subsets: ["latin"] });

function useQuery() {
  return new URLSearchParams(window.location.search);
}

export default function ResetPage() {

  const query = useQuery();

  if (!query.get('oobCode')) {
    window.location.href = '/login';
  }
  const oobCode = query.get('oobCode')!;

  const auth = getAuth(app);
  const [password, setPassword] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState('');

  verifyPasswordResetCode(auth, oobCode).catch((error) => {
    window.location.href = '/login';
  });

  const handleReset = (e:any) => {
    e.preventDefault();
    if (e.target.password.value !== e.target.c_password.value) {
      setError('Passwords do not match');
      return;
    }
    if (e.target.password.value.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    confirmPasswordReset(auth, oobCode, e.target.password.value).then(() => {
      setReset(true);
    }).catch((error) => {
      setError(error.message);
    }); 
    setError('');
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
            <h1 className={"text-4xl font-semibold "+albert.className}>Reset password</h1>
            {reset ? <>
            <p className="text-sm">Your password has been successfully reset. </p>
            </> : <>
            <p className="text-sm">Enter your new password below to complete the reset<br /> process. Ensure it&apos;s strong and secure.
            </p>
            <form onSubmit={handleReset} className="space-y-3">
              <ThemeProvider theme={theme}>
                
              <div className="text-left space-y-1">
                  <label htmlFor="password" className="font-medium text-sm">New Password</label>
                  <TextField id="password" 
                    name="password"
                    type={password?"text":"password"} 
                    placeholder={password?"password":"********"} 
                    required 
                    size="small" 
                    variant="outlined" 
                    hiddenLabel 
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {password ? <Visibility className="cursor-pointer" onClick={() => setPassword(false)} /> : <VisibilityOff className="cursor-pointer" onClick={() => setPassword(true)} />}
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
                <div className="text-left space-y-1">
                  <label htmlFor="c_password" className="font-medium text-sm">Confirm new Password</label>
                  <TextField id="c_password" 
                    name="c_password"
                    type={password?"text":"password"} 
                    placeholder={password?"password":"********"} 
                    required 
                    size="small" 
                    variant="outlined" 
                    hiddenLabel 
                    fullWidth 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {password ? <Visibility className="cursor-pointer" onClick={() => setPassword(false)} /> : <VisibilityOff className="cursor-pointer" onClick={() => setPassword(true)} />}
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
                <Button variant="contained" className="normal-case" type="submit" disableElevation fullWidth>Reset</Button>
              </ThemeProvider>
            </form>
            <p className="text-sm text-red-500">{error}</p>
            </>}
            <p className="text-sm"><a className="font-medium text-study-orange" href="/login">&lt;- Go back to login</a></p>
        </div>
    </main>
  );
}
