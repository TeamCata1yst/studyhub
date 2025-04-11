"use client";
import { app, storage } from "@/firebase";
import { getAuth, signOut, onAuthStateChanged, updateProfile, sendEmailVerification } from "firebase/auth";
import { Albert_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { Button, ThemeProvider, createTheme } from "@mui/material";

import config from "@/tailwind.config";
import { Logout } from "@mui/icons-material";
const tailwindConfig = config as any;
const studyOrange = tailwindConfig.theme.extend.colors["study-orange"];

const albert = Albert_Sans({ subsets: ["latin"] });

export default function Home() {

  const auth = getAuth(app);
  const [verified, setVerified] = useState(true);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setVerified(user.emailVerified);
      } else {
        window.location.href = '/login';
      }
    });
    // console.log('user', user);
  }, [user]);

  const handleLogout = async () => {
    signOut(auth).then(() => {
      fetch('/api/signout').then((res) => {
        if (res.ok) {
          window.location.href = '/login';
        }
      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleChangePFP = (e:any) => {
    e.preventDefault()
    const file = e.target[0].files[0];
    const storageRef = ref(storage, 'profile_pictures/' + user.uid);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
      updateProfile(auth.currentUser!, {
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/studyhub-db.appspot.com/o/profile_pictures%2F' + user.uid + '?alt=media'
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleResendVerification = () => {
    sendEmailVerification(auth.currentUser!).catch((error) => {
      console.log(error);
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
    <main>
      {!verified &&
        <div className="flex fixed inset-0 justify-center items-center bg-[#eee]/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg lg:w-1/3 md:m-0 md:w-1/2 m-8 space-y-3 text-center">
            <h1 className={albert.className+" text-2xl font-semibold"}>Please verify your email address to continue.</h1>
            <p>We have sent a verification email to {user?.email}. Please verify your email address to continue.</p>
            <ThemeProvider theme={theme}>  
              <Button variant="contained" className="normal-case" disableElevation target="_blank" fullWidth href="https://mail.google.com/mail/u/0/">Open Gmail</Button>
              <p className="text-sm">Didn&apos;t receive the email? <a onClick={handleResendVerification} className="font-medium text-study-orange cursor-pointer">Resend</a></p>
              <Button variant="text" onClick={handleLogout} className="normal-case" disableElevation startIcon={<Logout />} fullWidth>Sign Out</Button>
            </ThemeProvider>
          </div>
        </div>
      }

      {user && <>
        <h1>Welcome, {user.displayName}</h1>
        <p>Your email is {user.email}</p>
        <img src={user.photoURL} alt="profile picture" />
      </>}

      <form onSubmit={handleChangePFP}>
        <input type="file" />
        <input type="submit" value="Change PFP" />
      </form>

      <button onClick={handleLogout}>sign out</button>
    </main>
  );
}
