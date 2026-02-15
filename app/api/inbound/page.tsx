"use client";
import { useState } from "react";
import { createTransaction } from "../actions"; // เดี๋ยวเราไปสร้างไฟล์นี้กัน

export default function InboundPage() {
  // สมมติรายการสินค้า (จริงๆ ต้องดึงจาก DB)
  const products = [
    { id: 1, name: "ท่อ EMT 1/2" },
    { id: 2, name: "สายไฟ THW" },
  ];

  async function handleSubmit(formData: FormData) {
    await createTransaction(formData);
    alert("บันทึกการส่งของแล้ว! รอนาย B ตรวจรับ");
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚚 นาย A: บันทึกการส่งของ</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label>สินค้า:</label>
          <select name="productId" className="border p-2 w-full rounded">
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4">
          <input name="quantity" type="number" placeholder="จำนวน" className="border p-2 w-full rounded" required />
          <input name="unit" type="text" placeholder="หน่วย (เช่น เส้น)" className="border p-2 w-full rounded" required />
        </div>

        <div className="flex gap-4">
          <input name="site" type="text" placeholder="Site (เช่น CM)" className="border p-2 w-full rounded" required />
          <input name="building" type="text" placeholder="อาคาร (เช่น F)" className="border p-2 w-full rounded" required />
        </div>

        <input name="sender" type="text" placeholder="ชื่อคนส่ง (นาย A)" className="border p-2 w-full rounded" required />

        <button type="submit" className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700">
          บันทึกส่งของ
        </button>
      </form>
    </div>
  );
}