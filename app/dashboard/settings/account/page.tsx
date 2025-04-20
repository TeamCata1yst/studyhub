import Link from "next/link";

export default async function ProfilePage() {
  return (
    <>
      <nav className="flex flex-col gap-2 w-1/6">
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline"
          href="/dashboard/settings/"
        >
          Profile
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 bg-accent font-medium"
          href="/dashboard/settings/account"
        >
          Account
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline"
          href="/dashboard/settings/security"
        >
          Security
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline"
          href="/dashboard/settings/other"
        >
          Other
        </Link>
      </nav>
      <div className="space-y-1">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm">Update your account settings.</p>
      </div>
    </>
  );
}
