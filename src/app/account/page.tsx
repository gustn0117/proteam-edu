"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  newsletter: number;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.user) { router.push("/login"); return; }
        setUser(d.user);
        setName(d.user.name || "");
        setOrganization(d.user.organization || "");
        setPhone(d.user.phone || "");
        setNewsletter(!!d.user.newsletter);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert("이름을 입력해주세요."); return; }
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organization, phone, newsletter }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "오류가 발생했습니다."); return; }
      alert("회원정보가 수정되었습니다.");
    } catch {
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) { alert("비밀번호를 입력해주세요."); return; }
    if (newPassword.length < 6) { alert("새 비밀번호는 6자 이상이어야 합니다."); return; }
    if (newPassword !== confirmPassword) { alert("새 비밀번호가 일치하지 않습니다."); return; }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
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
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div>
      {/* Page Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">내 정보 관리</h1>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">홈</Link>
              <span>&gt;</span>
              <span className="text-gray-900 font-medium">내 정보 관리</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
        {/* 회원정보 수정 */}
        <div>
          <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            회원정보 수정
          </h2>
          <form onSubmit={handleProfileSave} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className={labelCls}>이메일</label>
              <input type="email" value={user?.email || ""} disabled
                className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
              <p className="text-xs text-gray-400 mt-1">이메일은 변경할 수 없습니다.</p>
            </div>
            <div>
              <label className={labelCls}>이름 *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>소속</label>
              <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>연락처</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678" className={inputCls} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}
                className="w-4 h-4 accent-primary" />
              <span className="text-sm text-gray-600">교육 소식 및 안내 메일 수신</span>
            </label>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={savingProfile}
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                {savingProfile ? "저장 중..." : "회원정보 저장"}
              </button>
            </div>
          </form>
        </div>

        {/* 비밀번호 변경 */}
        <div>
          <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            비밀번호 변경
          </h2>
          <form onSubmit={handlePasswordSave} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className={labelCls}>현재 비밀번호 *</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>새 비밀번호 *</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password" placeholder="6자 이상" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>새 비밀번호 확인 *</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password" className={inputCls} />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={savingPassword}
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                {savingPassword ? "변경 중..." : "비밀번호 변경"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
