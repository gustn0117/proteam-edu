"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword.length < 4) {
      alert("새 비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "오류가 발생했습니다."); return; }
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">관리자 설정</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg">
        <h3 className="text-base font-bold text-gray-900 mb-4">관리자 비밀번호 변경</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>현재 비밀번호 *</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>새 비밀번호 *</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password" placeholder="4자 이상" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>새 비밀번호 확인 *</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password" className={inputCls} />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
              {saving ? "변경 중..." : "비밀번호 변경"}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          ※ 비밀번호 변경 후, 모든 관리자 세션은 유지됩니다. 다음 로그인부터 새 비밀번호를 사용하세요.
        </p>
      </div>
    </div>
  );
}
