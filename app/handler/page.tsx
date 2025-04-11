'use client';

function useQuery() {
  return new URLSearchParams(window.location.search);
}

import ResetPage from "./resetpage";
import VerifyEmail from "./verifypage";

export default function Handler() {
  const query = useQuery();
  const action = query.get('mode');
  if (!action) {
    window.location.href = '/';
    return;
  }
  if (action === 'resetPassword') {
    return <ResetPage />;
  }
  if (action === 'verifyEmail') {
    return <VerifyEmail />;
  }
}
