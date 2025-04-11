"use client";
import { Albert_Sans } from "next/font/google";
import { School, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, ThemeProvider, InputAdornment } from "@mui/material";
import config from "@/tailwind.config";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import { app, database } from "@/firebase";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, UserCredential, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createHash } from "crypto";

const tailwindConfig = config as any;
const studyOrange = tailwindConfig.theme.extend.colors["study-orange"];

const albert = Albert_Sans({ subsets: ["latin"] });

interface UserCredential1 extends UserCredential {
  _tokenResponse?: any;
}

export default function Home() {

  const auth = getAuth(app);
  const [error, setError] = useState('');
  const [login, setLogin] = useState('Login');

  const handleGoogleSignIn = async (e:any) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result:UserCredential1) => {
      setLogin('Logging in...');
      const user = result.user;
      const tokenResponse = result._tokenResponse;
      const newUser = tokenResponse.isNewUser;
      if (newUser) {
        const t_email = user.email?.trim().toLowerCase()!;
        const hash = createHash('sha256').update(t_email).digest('hex');
        updateProfile(user, {
          photoURL: `https://www.gravatar.com/avatar/${hash}?d=identicon`
        });
        console.log('new user');
        const docRef = doc(database, "users", user.uid);
        const userDoc = {
          email: user.email,
          mobile: ""
        };
        setDoc(docRef, userDoc);
      }
      user.getIdToken().then((token) => {
        fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }).then((res) => {
          if (res.ok) {
            window.location.href = "/";
          }
        }).catch((err) => {
          console.log(err);
          setError("An error occurred. Please try again later.");
          setLogin('Login');
        });
      })
    })
    .catch((error) => {
      console.log(error);
      setError("An error occurred. Please try again later.");
      setLogin('Login');
    });
    setError('');
  }

  const handleSignIn = async (e:any) => {
    e.preventDefault();
    setLogin('Logging in...');
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.getIdToken().then((token) => {
        fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }).then((res) => {
          if (res.ok) {
            window.location.href = "/";
          }
        }).catch((err) => {
          console.log(err);
          setError("An error occurred. Please try again later.");
          setLogin('Login');
        });
      })
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
        setLogin('Login');
      }
      else {
        setError("An error occurred. Please try again later.");
        setLogin('Login');
      }
    });
    setError('');
  }

  const [password, setPassword] = useState(false);
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
            <h1 className={"text-4xl font-semibold "+albert.className}>Welcome </h1>
            <p className="text-sm">Glad to see you again 👋<br />Login to your account below</p>
            <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 normal-case font-medium text-base rounded-md border border-gray-300 w-full py-2 hover:border-gray-400"><Google fontSize="small" className="text-study-orange" /> Continue with Google</button>
            <form onSubmit={handleSignIn} className="space-y-3">
              <ThemeProvider theme={theme}>
                <div className="text-left space-y-1">
                  <label htmlFor="email" className="font-medium text-sm">Email</label>
                  <TextField id="email" type="email" placeholder="example@gmail.com" required size="small" variant="outlined" hiddenLabel fullWidth />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex justify-between">
                    <label htmlFor="password" className="font-medium text-sm w-max">Password</label>
                    <a href="/forgot" className="font-medium text-sm w-max hover:text-study-orange">Forgot?</a>
                  </div>
                  <TextField id="password" 
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
                <Button variant="contained" className="normal-case" type="submit" disableElevation fullWidth>{login}</Button>
              </ThemeProvider>
            </form>
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-sm">Don&apos;t have an account? <a className="font-medium text-study-orange" href="/signup">Sign Up for Free</a></p>
        </div>
    </main>
  );
}
