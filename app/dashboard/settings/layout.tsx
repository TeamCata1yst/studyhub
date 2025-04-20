import { Albert_Sans } from "next/font/google";
const albert = Albert_Sans({ subsets: ["latin"] });

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="space-y-1">
        <h1 className={albert.className + " text-2xl font-semibold"}>
          Settings
        </h1>
        <p className={albert.className + "font-medium"}>
          Manage your account settings and set preferences.
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex md:flex-row flex-col gap-4">{children}</div>
    </>
  );
}
