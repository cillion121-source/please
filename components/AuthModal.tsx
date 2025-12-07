
import React, { useState } from 'react';
import { X, User, Envelope, Lock, ArrowRight, IdentificationCard, Buildings } from 'phosphor-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string; type: 'member' | 'guest' }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (mode === 'signup' && !name) return alert('이름을 입력해주세요.');
    if (!email || !password) return alert('이메일과 비밀번호를 입력해주세요.');

    // LocalStorage Logic
    try {
      const storedUsers = localStorage.getItem('biz_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      if (mode === 'signup') {
        // Check for duplicate email
        if (users.find((u: any) => u.email === email)) {
          alert('이미 가입된 이메일입니다.');
          return;
        }

        const newUser = { name, email, password, type: 'member' };
        users.push(newUser);
        localStorage.setItem('biz_users', JSON.stringify(users));

        alert('회원가입이 완료되었습니다. 자동 로그인됩니다.');
        onLogin({ name, email, type: 'member' });
        onClose();
      } else {
        // Login Logic
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          onLogin({ name: user.name, email: user.email, type: 'member' });
          onClose();
        } else {
          alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
      }

      // Reset Form
      if (mode === 'signup') {
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleGuestLogin = () => {
    onLogin({ name: '게스트', email: 'guest', type: 'guest' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-slate-200 dark:border-slate-700">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 z-10"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 transform rotate-3">
                <Buildings size={36} weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              BizInsight <span className="text-blue-500">AI</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              상권 분석의 모든 것, 데이터로 성공하세요.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              회원가입
            </button>
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              로그인
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">이름</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">이메일</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Envelope size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">비밀번호</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {mode === 'signup' ? '무료로 시작하기' : '로그인'}
              <ArrowRight weight="bold" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
             <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
             <span className="text-xs text-slate-400 font-medium">Guest Access</span>
             <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          </div>

          <div className="mt-4">
             {/* Guest Mode Button */}
             <button 
                onClick={handleGuestLogin}
                className="w-full py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2 group"
             >
                <IdentificationCard size={20} className="text-slate-400 group-hover:text-blue-500" />
                <span>로그인 없이 둘러보기</span>
             </button>
             <p className="text-[11px] text-center text-slate-400 mt-2">
               게스트 모드에서는 분석 기록이 저장되지 않습니다.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
