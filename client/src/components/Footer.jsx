const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white mt-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-brand-navy w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
            <div className="bg-white/10 text-white p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">SkillBridge</span>
        </div>
        <div className="text-sm text-gray-300">
          &copy; {new Date().getFullYear()} SkillBridge Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
