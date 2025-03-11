"use client";

import { useSession, signIn } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Please <button onClick={() => signIn()} className="text-blue-500">log in</button> to access.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
      <p>You can now manage events and sponsorships.</p>
    </div>
  );
}
