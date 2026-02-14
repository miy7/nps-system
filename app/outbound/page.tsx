// app/outbound/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ตัวช่วยเปลี่ยนหน้า

export default function OutboundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // สถานะรอโหลด

  // ข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    site: 'Site A - โครงการคอนโด',
    product: 'ท่อ EMT 1/2"', // **สำคัญ** ชื่อตรงนี้ต้องตรงกับใน Database เป๊ะๆ นะครับ
    quantity: 0,
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // เริ่มหมุนติ้วๆ

    try {
      // 1. ยิงข้อมูลไปที่ API
      const response = await fetch('/api/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.product,
          quantity: formData.quantity,
          site: formData.site
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 2. ถ้าสำเร็จ
        alert('✅ ' + result.message);
        router.push('/'); // เด้งกลับไปหน้า Dashboard เพื่อดูยอดที่ลดลง
      } else {
        // 3. ถ้าล้มเหลว (เช่น ของหมด)
        alert('❌ ' + result.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false); // หยุดหมุน
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">🚚 บันทึกการส่งของ (Outbound)</h1>
          <Link href="/" className="text-sm bg-blue-800 px-3 py-1 rounded hover:bg-blue-900 transition">
            ← กลับหน้าหลัก
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* ... (ส่วนเลือก Site เหมือนเดิม) ... */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">ไปส่งที่ไซต์งานไหน?</label>
            <select 
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              value={formData.site}
              onChange={(e) => setFormData({...formData, site: e.target.value})}
            >
              <option>Site A - โครงการคอนโด</option>
              <option>Site B - โรงงานอุตสาหกรรม</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">เลือกวัสดุ</label>
              {/* เลือกสินค้า (ชื่อต้องตรง DB) */}
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              >
                {/* ⚠️ ตัวเลือกตรงนี้ต้องตรงกับชื่อใน Database เป๊ะๆ */}
                <option value='ท่อ EMT 1/2"'>ท่อ EMT 1/2"</option>
                <option value='ท่อ EMT 3/4"'>ท่อ EMT 3/4"</option>
                <option value='ท่อ IMC 1"'>ท่อ IMC 1"</option>
                <option value='สายไฟ THW 16 sq.mm'>สายไฟ THW 16 sq.mm</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">จำนวน</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 p-3 rounded-lg text-black"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-lg shadow transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'กำลังบันทึก...' : 'ยืนยันการส่งของ'}
          </button>
        </form>
      </div>
    </div>
  );
}