# BBook Frontend

หน้าเว็บสำหรับระบบจองห้องประชุม เขียนด้วย [Next.js 16](https://nextjs.org/) (App Router)

## Tech Stack

- Next.js 16 (App Router, Server Components, Server Actions)
- React 19
- Tailwind CSS + shadcn/ui (Base UI primitives)
- `@line/liff` (ผูกบัญชี LINE ผ่าน LIFF)

> **หมายเหตุ:** โปรเจกต์นี้ใช้ Next.js เวอร์ชันที่มี breaking changes จากเวอร์ชันก่อนหน้า (เช่น Middleware ถูกเปลี่ยนชื่อเป็น **Proxy** — ไฟล์ `proxy.ts` ไม่ใช่ `middleware.ts`) อ่านรายละเอียดเพิ่มเติมได้ที่ `node_modules/next/dist/docs/`

## โครงสร้างหน้า

```
app/
├── login/          # เข้าสู่ระบบ (Server Action, เซ็ต httpOnly cookie)
├── register/        # สมัครสมาชิก
├── bookings/         # การจองของฉัน (ดู/ยกเลิก)
├── liff-link/        # ผูกบัญชี LINE ผ่าน LIFF
├── page.tsx          # หน้าหลัก: list ห้อง + ฟอร์มจอง
└── booking-form.tsx   # ฟอร์มจองห้อง (Client Component)

proxy.ts               # ป้องกันหน้าที่ต้อง login (optimistic cookie check)
lib/api.ts              # helper เรียก backend (apiFetch / apiFetchAuth)
```

## ติดตั้ง

```bash
npm install
```

### ตั้งค่า Environment Variables

สร้างไฟล์ `.env`:

```
API_URL="http://localhost:3001"
NEXT_PUBLIC_LIFF_ID="<LIFF ID จาก LINE Developers Console>"
```

## รัน

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## สถาปัตยกรรม Auth

- Token (access + refresh) เก็บเป็น **httpOnly cookie** — JavaScript ฝั่ง browser เข้าถึงไม่ได้เลย ป้องกัน XSS
- ทุก request ที่ต้อง auth ยิงผ่าน **Server Action/Server Component** เท่านั้น (เรียก backend แบบ server-to-server) browser ไม่เคยเห็น token
- `proxy.ts` เช็คแค่ "มี cookie ไหม" (optimistic check) — **ไม่ใช่ด่านความปลอดภัยจริง** แค่กัน UX ไม่ให้เห็นหน้าที่ไม่ควรเห็นก่อนเวลา ด่านความปลอดภัยจริงอยู่ที่ backend guard

## ทดสอบ LIFF (ผูกบัญชี LINE) แบบ local

LINE ต้องเข้าถึง Endpoint URL ได้จริงจากอินเทอร์เน็ต ใช้ [ngrok](https://ngrok.com/) tunnel:

```bash
ngrok http 3000
```

แล้วอัปเดต:
1. Endpoint URL ในหน้า LIFF ของ LINE Developers Console ให้ตรงกับ ngrok URL
2. `allowedDevOrigins` ใน `next.config.ts` ให้มี ngrok domain (จำเป็นเพราะ Next.js บล็อก cross-origin dev request โดย default)
