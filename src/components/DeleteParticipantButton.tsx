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
        className="px-3 py-1.5 rounded-md bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Menghapus..." : "Hapus Data"}
      </button>
    </div>
  );
}
