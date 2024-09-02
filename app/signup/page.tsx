"use client";
import { Albert_Sans } from "next/font/google";
import { School, Visibility, Google, VisibilityOff, CalendarMonth } from "@mui/icons-material";
import { TextField, Button, ThemeProvider, InputAdornment } from "@mui/material";
import config from "@/tailwind.config";
import { createTheme } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { createHash } from "crypto";
import { MuiTelInput } from "mui-tel-input";
import { app, database } from "@/firebase";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendEmailVerification, signInWithPopup, updateProfile, UserCredential } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
const tailwindConfig = config as any;
const studyOrange = tailwindConfig.theme.extend.colors["study-orange"];

const albert = Albert_Sans({ subsets: ["latin"] });

interface UserCredential1 extends UserCredential {
  _tokenResponse?: any;
}

export default function Home() {

  const auth = getAuth(app);

  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [signup, setSignup] = useState('Confirm');
  const [password, setPassword] = useState(false);
  const theme = createTheme({
    palette: {
      primary: {
        main: studyOrange
      },
    },
  });

  const handleGoogleSignup = async (e:any) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result:UserCredential1) => {
      setSignup('Logging in...');
      const user = result.user;
      const tokenResponse = result._tokenResponse;
      const newUser = tokenResponse.isNewUser;
      console.log(tokenResponse);
      if (newUser) {
        setSignup('Signing up...');
        const t_email = user.email?.trim().toLowerCase()!;
        const hash = createHash('sha256').update(t_email).digest('hex');
        updateProfile(user, {
          photoURL: `https://www.gravatar.com/avatar/${hash}?d=identicon`
        });
        console.log('new user');
        const docRef = doc(database, "users", user.uid);
        const userDoc = {
          email: user.email,
          mobile: ''
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
          setSignup('Confirm');
        });
      })
    }).catch((err:any) => {
      const errorCode = err.code;
      const errorMessage = err.message;
      const email = err.email;
      const credential = GoogleAuthProvider.credentialFromError(err);
      console.log(errorCode, errorMessage, email, credential);
      setError("An error occurred. Please try again later.");
      setSignup('Confirm');
    });
  }

  const handleCreate = async (e:any) => {
    e.preventDefault();
    setSignup('Signing up...');
    const name = e.target.name.value;
    const email = e.target.email.value;
    const dob = e.target.dob.value;
    const mobile = e.target.mobile.value;
    const password = e.target.password.value;
    const c_password = e.target.c_password.value;
    if (password !== c_password) {
      setError("Passwords do not match");
      setSignup('Confirm');
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setSignup('Confirm');
      return;
    }
    if (!dob) {
      setError("Date of Birth is required");
      setSignup('Confirm');
      return;
    } else if (dayjs(dob).isAfter(dayjs())) {
      setError("Invalid Date of Birth");
      setSignup('Confirm');
      return;
    } else if (dayjs().diff(dayjs(dob), 'year') < 13) {
      setError("You must be at least 13 years old to create an account");
      setSignup('Confirm');
      return;
    }
    setError('');
    console.log(name, email, dob, mobile, password);
    createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      const user = result.user;
      const docRef = doc(database, "users", user.uid);
      const userDoc = {
        email: email,
        mobile: mobile
      };
      setDoc(docRef, userDoc);
      sendEmailVerification(user);
      const t_email = user.email?.trim().toLowerCase()!;
      const hash = createHash('sha256').update(t_email).digest('hex');
      updateProfile(user, {
        displayName: name,
        photoURL: `https://www.gravatar.com/avatar/${hash}?d=identicon`
      }).then(() => {      
        // console.log(user);
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
          });
        }).catch((err) => {
          console.log(err);
          setError("An error occurred. Please try again later.");
        });
      }).catch((err) => {
        console.log(err);
        setError("An error occurred. Please try again later.");
      });
    }).catch((err:any) => {
      const errorCode = err.code;

      if (errorCode === "auth/email-already-in-use") {
        setError("Email already in use");
        setSignup('Confirm');
      } else if (errorCode === "auth/invalid-email") {
        setError("Invalid email address");
        setSignup('Confirm');
      } else if (errorCode === "auth/weak-password") {
        setError("Weak password");
        setSignup('Confirm');
      } else if (errorCode === "auth/operation-not-allowed") {
        setError("Operation not allowed");
        setSignup('Confirm');
      }
    });
  }

  return (
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
        <div className="absolute hidden md:block bottom-0 right-0 bg-[url('/loginBg.svg')] h-screen w-screen bg-right-bottom z-0 bg-no-repeat"></div>
        <div className="bg-white rounded-md p-8 lg:ml-32 space-y-4 w-[50rem] z-20">
            <School className="text-5xl text-study-orange" />
            <h1 className={"text-4xl font-semibold "+albert.className}>Sign up</h1>
            <p className="text-sm">Enter your details below to create your account and get started.</p>
            <button onClick={handleGoogleSignup} className="flex items-center justify-center gap-2 normal-case font-medium text-base rounded-md border border-gray-300 w-full py-2 hover:border-gray-400"><Google fontSize="small" className="text-study-orange" /> Continue with Google</button>
            <form className="grid md:grid-cols-2 gap-3" onSubmit={handleCreate}>
              <ThemeProvider theme={theme}>
                <div className="text-left space-y-1">
                  <label htmlFor="name" className="font-medium text-sm">Full Name</label>
                  <TextField id="name" 
                    name="name"
                    placeholder="John Doe" 
                    size="small" 
                    required 
                    variant="outlined" 
                    hiddenLabel 
                    fullWidth 
                  />
                </div>
                <div className="text-left space-y-1">
                  <label htmlFor="email" className="font-medium text-sm">Email</label>
                  <TextField id="email" 
                    name="email"
                    type="email" 
                    placeholder="example@gmail.com" 
                    required 
                    size="small" 
                    variant="outlined" 
                    hiddenLabel 
                    fullWidth 
                  />
                </div>
                <div className="text-left space-y-1">
                  <label htmlFor="dob" className="font-medium text-sm">Date of Birth</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker name="dob"
                      openTo="year"
                      disableFuture
                      slotProps={{
                        textField: {
                          required: true,
                          id: "dob",
                          size: "small",
                          variant: "outlined",
                          hiddenLabel: true,
                          fullWidth: true,
                          placeholder: "MM/DD/YYYY",
                          InputProps: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <CalendarMonth className="cursor-pointer" />
                              </InputAdornment>
                            )
                          }
                        }
                    }} />
                  </LocalizationProvider>
                </div>
                <div className="text-left space-y-1">
                  <label htmlFor="mobile" className="font-medium text-sm">Phone Number</label>
                  <MuiTelInput id="mobile" 
                    name="mobile"
                    value={phone}
                    onChange={(e) => setPhone(e)}
                    defaultCountry="IN"
                    size="small" 
                    variant="outlined" 
                    hiddenLabel 
                    fullWidth
                  />
                </div>
                <div className="text-left space-y-1">
                  <label htmlFor="password" className="font-medium text-sm">Password</label>
                  <TextField id="password" 
                    name="password"
                    type={password?"text":"password"} 
                    placeholder={password?"johnrox1":"********"} 
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
                  <label htmlFor="c_password" className="font-medium text-sm">Confirm Password</label>
                  <TextField id="c_password" 
                    name="c_password"
                    type={password?"text":"password"} 
                    placeholder={password?"johnrox1":"********"} 
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
                <Button onClick={(e)=>{
                  e.preventDefault();
                  const form = document.querySelector("form") as HTMLFormElement;
                  form.reset();
                  setError('');
                }} variant="outlined" className="normal-case" disableElevation fullWidth>Cancel</Button>
                <Button variant="contained" type="submit" className="normal-case" disableElevation fullWidth>{signup}</Button>
              </ThemeProvider>
            </form>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-sm">Already have an account? <a className="font-medium text-study-orange" href="/login">Login</a></p>
        </div>
    </main>
  );
}
