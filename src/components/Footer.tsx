export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p className="font-semibold text-gray-300">㈜프로앤팀 교육센터</p>
        <p className="mt-1">이메일: edu@proteambiz.com</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} ProTeam Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
