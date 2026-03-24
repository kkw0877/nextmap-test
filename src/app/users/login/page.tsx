"use client"

import Kakao from "next-auth/providers/kakao";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineGoogle } from "react-icons/ai"

// Naver - #2db400
// Kakao - #fef01b

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [router, status])


  return (
    <div className="flex flex-col justify-center h-[60vh] px-6 lg:px-8">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-blue-800 text-center text-2xl font-semibold italic">Next Map</div>
        <div className="text-center mt-6 text-2xl font-bold text-gray-600">SNS 계정으로 로그인해주세요</div>
        <p className="text-center mt-2 text-sm text-gray-600">계정이 없다면 자동으로 회원가입이 진행됩니다</p>
      </div>
      <div className="w-full max-w-sm mx-auto mt-10">
        <div className="flex flex-col gap-3">
          <button 
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })} 
            className="flex items-center justify-center gap-4 w-full px-5 py-4 text-white text-center bg-[#4285F4] hover:bg-[#4285F4]/90 font-medium rounded-lg"
          >
            <AiOutlineGoogle className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
