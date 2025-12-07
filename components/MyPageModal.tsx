
import React, { useState, useEffect } from 'react';
import { User, Envelope, Crown, SignOut, X, PencilSimple, FloppyDisk, ChartBar, ShieldCheck, CreditCard } from 'phosphor-react';

interface UserData {
  name: string;
  email: string;
  type: 'member' | 'guest';
}

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  historyCount: number;
  onLogout: () => void;
  onUpdateUser: (newName: string) => void;
  onUpgrade: () => void;
}

const MyPageModal: React.FC<MyPageModalProps> = ({ isOpen, onClose, user, historyCount, onLogout, onUpdateUser, onUpgrade }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    if (editName.trim().length === 0) return alert("이름을 입력해주세요.");
    onUpdateUser(editName);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header Gradient Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 -mt-12 flex flex-col items-center relative z-10 overflow-y-auto custom-scrollbar">
          
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-xl mb-4">
            <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-inner ${user.type === 'guest' ? 'bg-slate-400' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
               {user.type === 'guest' ? <User /> : user.name[0]}
            </div>
          </div>

          {/* Name & Badge */}
          <div className="text-center mb-6 w-full">
            <div className="flex items-center justify-center gap-2 mb-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-b-2 border-blue-500 bg-transparent text-center font-bold text-xl text-slate-800 dark:text-white focus:outline-none w-32 pb-1"
                    autoFocus
                  />
                  <button onClick={handleSave} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <FloppyDisk size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
                  {user.type === 'member' && (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                      title="이름 변경"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                  )}
                </>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Envelope size={14} /> {user.email}
            </p>
            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit mx-auto ${
                user.type === 'member' 
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200 text-amber-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'
              }`}>
                {user.type === 'member' ? <Crown weight="fill" className="text-amber-500" /> : <User weight="fill" />}
                {user.type === 'member' ? 'Premium Member' : 'Guest Account'}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-2">
                <ChartBar size={20} weight="fill" />
              </div>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{historyCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">분석 리포트</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mb-2">
                <ShieldCheck size={20} weight="fill" />
              </div>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">Active</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">계정 상태</span>
            </div>
          </div>

          {/* Menu / Info List */}
          <div className="w-full space-y-2 mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">계정 정보</h3>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
               <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <CreditCard size={18} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">구독 플랜</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.type === 'member' ? 'Standard Plan (무료)' : '체험판'}</p>
                     </div>
                  </div>
                  {user.type === 'guest' && (
                    <button 
                      onClick={onUpgrade}
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      업그레이드
                    </button>
                  )}
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <ShieldCheck size={18} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">개인정보 보호</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">안전하게 보호 중입니다</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="w-full py-3.5 rounded-xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <SignOut size={18} weight="bold" /> 로그아웃
          </button>

        </div>
      </div>
    </div>
  );
};

export default MyPageModal;
