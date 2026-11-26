import React from 'react';

export function ReaderAvatar({ type, className = 'w-16 h-16' }) {
  if (type === 'firstGrader') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="1학년 동생 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
        <path d="M20 33C20 20 29 13 40 13C51 13 60 20 60 33H20Z" fill="#FBBF24" />
        <rect x="16" y="30" width="48" height="6" rx="3" fill="#F59E0B" />
        <circle cx="40" cy="46" r="17" fill="#FDE68A" />
        <circle cx="29" cy="49" r="3" fill="#FDA4AF" opacity="0.7" />
        <circle cx="51" cy="49" r="3" fill="#FDA4AF" opacity="0.7" />
        <circle cx="33.5" cy="44" r="2.4" fill="#1E293B" />
        <circle cx="46.5" cy="44" r="2.4" fill="#1E293B" />
        <circle cx="34.3" cy="43.2" r="0.8" fill="#FFFFFF" />
        <circle cx="47.3" cy="43.2" r="0.8" fill="#FFFFFF" />
        <path d="M35 51.5C36.8 54 43.2 54 45 51.5" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'peerFriend') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="6학년 또래 친구 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2.5" />
        <path d="M21 39C21 24 29 16 40 16C51 16 59 24 59 39V42H21V39Z" fill="#334155" />
        <path d="M19 42C19 25 28 15 40 15C52 15 61 25 61 42" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="15" y="37" width="7" height="14" rx="3.5" fill="#0EA5E9" />
        <rect x="58" y="37" width="7" height="14" rx="3.5" fill="#0EA5E9" />
        <circle cx="40" cy="45" r="16.5" fill="#FED7AA" />
        <path d="M24 37C28 31 35 29 40 31C45 29 52 31 56 37C51 34 45 34 40 36C35 34 29 34 24 37Z" fill="#334155" />
        <circle cx="34" cy="44.5" r="2.3" fill="#1E293B" />
        <circle cx="46" cy="44.5" r="2.3" fill="#1E293B" />
        <path d="M35 51.5C37.5 54 42.5 54 45 51.5" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'transferStudent') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="전학 온 새 친구 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
        <path d="M21 40C21 24 29 16 40 16C51 16 59 24 59 40V47H21V40Z" fill="#475569" />
        <circle cx="40" cy="45" r="16.5" fill="#FDE68A" />
        <path d="M24 35C29 28 36 28 40 30C44 28 51 28 56 35C50 32 44 33 40 34C36 33 30 32 24 35Z" fill="#475569" />
        <circle cx="29" cy="48" r="2.8" fill="#FDA4AF" opacity="0.7" />
        <circle cx="51" cy="48" r="2.8" fill="#FDA4AF" opacity="0.7" />
        <circle cx="34" cy="44" r="2.3" fill="#1E293B" />
        <circle cx="46" cy="44" r="2.3" fill="#1E293B" />
        <path d="M36 51.5C38 53.5 42 53.5 44 51.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'parents') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="부모님 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        <circle cx="30" cy="44" r="12.5" fill="#FED7AA" />
        <path d="M18 40C18 31 23 26 30 26C37 26 42 31 42 40H18Z" fill="#334155" />
        <circle cx="26" cy="44" r="1.8" fill="#1E293B" />
        <circle cx="34" cy="44" r="1.8" fill="#1E293B" />
        <path d="M27 49.5C29 51 31 51 33 49.5" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="50" cy="45" r="12.5" fill="#FDE68A" />
        <path d="M37 44C37 33 43 27 50 27C57 27 63 33 63 44V52H37V44Z" fill="#78350F" />
        <circle cx="50" cy="46" r="11.5" fill="#FDE68A" />
        <circle cx="46" cy="45" r="1.8" fill="#1E293B" />
        <circle cx="54" cy="45" r="1.8" fill="#1E293B" />
        <path d="M47 50.5C49 52 51 52 53 50.5" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'neighbors') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="이웃 주민 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
        <path d="M22 61C22 52 30 48 40 48C50 48 58 52 58 61" fill="#38BDF8" />
        <path d="M23 39C23 24 31 17 40 17C49 17 57 24 57 39H23Z" fill="#64748B" />
        <circle cx="40" cy="43" r="15.5" fill="#FED7AA" />
        <circle cx="34.5" cy="42" r="2.1" fill="#1E293B" />
        <circle cx="45.5" cy="42" r="2.1" fill="#1E293B" />
        <path d="M35.5 49C38 51.5 42 51.5 44.5 49" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'nurseTeacher') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="보건 선생님 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#FFE4E6" stroke="#F43F5E" strokeWidth="2.5" />
        <path d="M21 41C21 24 29 17 40 17C51 17 59 24 59 41V52H21V41Z" fill="#475569" />
        <circle cx="40" cy="45" r="16" fill="#FDE68A" />
        <rect x="34" y="19" width="12" height="7" rx="2" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="1.5" />
        <path d="M40 20.5V24.5M38 22.5H42" stroke="#F43F5E" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="34" cy="44" r="2.2" fill="#1E293B" />
        <circle cx="46" cy="44" r="2.2" fill="#1E293B" />
        <path d="M35 51C37.5 53.5 42.5 53.5 45 51" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'kindergartener') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="유치원 동생 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2.5" />
        <circle cx="24" cy="27" r="7" fill="#F472B6" />
        <circle cx="56" cy="27" r="7" fill="#F472B6" />
        <circle cx="40" cy="44" r="17" fill="#FDE68A" />
        <path d="M23 39C25 27 32 22 40 22C48 22 55 27 57 39C51 34 45 34 40 35C35 34 29 34 23 39Z" fill="#78350F" />
        <circle cx="29" cy="47" r="3.2" fill="#FDA4AF" opacity="0.75" />
        <circle cx="51" cy="47" r="3.2" fill="#FDA4AF" opacity="0.75" />
        <circle cx="33.5" cy="43" r="2.5" fill="#1E293B" />
        <circle cx="46.5" cy="43" r="2.5" fill="#1E293B" />
        <path d="M36 50.5C38 53 42 53 44 50.5" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'mayor') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="구청장님 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2.5" />
        <path d="M23 37C23 23 31 17 40 17C49 17 57 23 57 37H23Z" fill="#334155" />
        <circle cx="40" cy="44" r="16" fill="#FED7AA" />
        <rect x="28" y="40" width="10" height="7" rx="2" stroke="#1E293B" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.35" />
        <rect x="42" y="40" width="10" height="7" rx="2" stroke="#1E293B" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.35" />
        <line x1="38" y1="43.5" x2="42" y2="43.5" stroke="#1E293B" strokeWidth="1.8" />
        <circle cx="33" cy="43.5" r="1.7" fill="#1E293B" />
        <circle cx="47" cy="43.5" r="1.7" fill="#1E293B" />
        <path d="M35 52C37.5 54 42.5 54 45 52" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 61L40 67L48 61" stroke="#4338CA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'junior') {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="5학년 후배 캐릭터">
        <circle cx="40" cy="40" r="38" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
        <path d="M22 39C22 23 30 16 40 16C50 16 58 23 58 39H22Z" fill="#1E293B" />
        <circle cx="40" cy="45" r="16.5" fill="#FDE68A" />
        <path d="M24 37C29 31 35 30 40 32C45 30 51 31 56 37C51 34 45 34 40 36C35 34 29 34 24 37Z" fill="#1E293B" />
        <circle cx="34" cy="44" r="2.3" fill="#1E293B" />
        <circle cx="46" cy="44" r="2.3" fill="#1E293B" />
        <path d="M35 51.5C37.5 54 42.5 54 45 51.5" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M58 22L60 26L64 26.5L61 29.5L61.8 33.5L58 31.5L54.2 33.5L55 29.5L52 26.5L56 26L58 22Z" fill="#FBBF24" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-label="교장 선생님 캐릭터">
      <circle cx="40" cy="40" r="38" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2.5" />
      <path d="M22 38C22 24 30 17 40 17C50 17 58 24 58 38H22Z" fill="#CBD5E1" />
      <circle cx="40" cy="45" r="16.5" fill="#FDE68A" />
      <circle cx="33.5" cy="44" r="5" stroke="#475569" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.4" />
      <circle cx="46.5" cy="44" r="5" stroke="#475569" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.4" />
      <line x1="38.5" y1="44" x2="41.5" y2="44" stroke="#475569" strokeWidth="1.8" />
      <circle cx="33.5" cy="44" r="1.8" fill="#1E293B" />
      <circle cx="46.5" cy="44" r="1.8" fill="#1E293B" />
      <path d="M35 52C37.5 54.5 42.5 54.5 45 52" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 62L40 68L49 62" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
