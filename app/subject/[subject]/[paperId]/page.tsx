"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string;

  useEffect(() => {
    // Directly redirect to the block MCQ page
    router.push(`/block/${subject}`);
  }, [subject, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-white font-semibold">Loading MCQs...</p>
      </div>
    </div>
  );
}
