"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHasilBelbin } from "@/actions/admin-actions";

interface DeleteParticipantButtonProps {
  id: string;
  nama: string;
}

export function DeleteParticipantButton({ id, nama }: DeleteParticipantButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data peserta "${nama}"? Data yang dihapus tidak dapat dipulihkan.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError("");

    const res = await deleteHasilBelbin(id);
    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error || "Gagal menghapus data.");
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p className="text-xs text-rose-600 mb-1.5 font-medium">{error}</p>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-2xs"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>{loading ? "Menghapus..." : "Hapus Data"}</span>
      </button>
    </div>
  );
}
