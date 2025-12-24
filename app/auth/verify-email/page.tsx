import { Suspense } from "react";
import VerifyEmailClient from "./VerifyClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailClient />
    </Suspense>
  );
}
