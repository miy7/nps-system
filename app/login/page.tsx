"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/"); // ล็อกอินผ่านแล้วไปหน้าแรก
      router.refresh();
    } else {
      alert("รหัสผ่านผิดครับ!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        {/* หัวข้อสีเข้ม */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          เข้าสู่ระบบ NPS
        </h1>
        
        {/* Label สีเทาเข้ม */}
        <label className="block mb-2 text-gray-700">ชื่อผู้ใช้</label>
        <input 
          className="border w-full p-2 mb-4 rounded text-black" /* <-- แก้สีตัวหนังสือตรงนี้ */
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="mr_a หรือ mr_b"
        />

        {/* Label สีเทาเข้ม */}
        <label className="block mb-2 text-gray-700">รหัสผ่าน</label>
        <input 
          type="password"
          className="border w-full p-2 mb-6 rounded text-black" /* <-- แก้สีตัวหนังสือตรงนี้ */
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="123"
        />

        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}