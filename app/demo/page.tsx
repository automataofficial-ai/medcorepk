"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to demo quiz
    router.push("/demo/quiz");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-white font-semibold">Starting demo quiz...</p>
      </div>
    </div>
  );
}
