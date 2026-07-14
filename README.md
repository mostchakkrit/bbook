# BBook — ระบบจองห้องประชุม

ระบบจองห้องประชุมสำหรับใช้ภายในองค์กร พนักงานจองห้องได้เอง ผ่านการอนุมัติจาก admin ก่อนยืนยัน พร้อมแจ้งเตือนผลผ่าน LINE

โปรเจกต์แยก Backend/Frontend เต็มรูปแบบ สื่อสารกันผ่าน REST API เท่านั้น

- **Backend:** [`bbook_backend`](./bbook_backend) — NestJS + PostgreSQL + Prisma
- **Frontend:** [`bbook_frontend`](./bbook_frontend) — Next.js 16 (App Router)

## ฟีเจอร์หลัก

- สมัครสมาชิก / เข้าสู่ระบบด้วย JWT (access + refresh token)
- จองห้องประชุมพร้อม **ตรวจจับเวลาจองซ้อนกันอัตโนมัติ** (conflict detection)
- Role-based access control — แยกสิทธิ์ employee / admin
- Admin อนุมัติ/ปฏิเสธการจอง
- ผูกบัญชี LINE ผ่าน LIFF และรับแจ้งเตือนผลการจองผ่าน LINE push message
- Auth ปลอดภัยด้วย httpOnly cookie (ไม่เก็บ token ใน localStorage)

## สถาปัตยกรรม

### Backend (NestJS)

| โมดูล | หน้าที่ |
|---|---|
| `auth` | JWT login/refresh/logout, role-based guard |
| `user` | สมัครสมาชิก, ผูกบัญชี LINE |
| `room` | CRUD ห้องประชุม |
| `book` | จอง/แก้/ยกเลิก พร้อม conflict-check, workflow อนุมัติ |
| `line` | verify LINE ID token, ส่ง push message |

### Frontend (Next.js App Router)

| หน้า | หน้าที่ |
|---|---|
| `/login`, `/register` | เข้าสู่ระบบ/สมัครสมาชิก ผ่าน Server Action |
| `/` | รายการห้อง + ฟอร์มจอง |
| `/bookings` | การจองของฉัน (ดู/ยกเลิก) |
| `/liff-link` | ผูกบัญชี LINE ผ่าน LIFF |
| `proxy.ts` | ป้องกันหน้าที่ต้อง login (optimistic check ด้วย cookie) |

## จุดเด่นทางเทคนิค

- **Conflict-check algorithm** — ตรวจจับช่วงเวลาทับซ้อนด้วยสูตร interval overlap (`start < newEnd && end > newStart`) ไม่ใช่แค่เทียบ start/end ตรงๆ
- **JWT + Refresh token rotation** — access token อายุสั้น (15 นาที) + refresh token เก็บ hash ไว้ใน DB ให้ revoke ได้จริง (bounded-window revocation)
- **httpOnly cookie** — token ไม่ผ่าน JavaScript ฝั่ง client เลย ป้องกัน XSS
- **Role-based Guard** — แยกสิทธิ์ admin/employee ผ่าน custom decorator + guard ที่ reuse ได้
- **External API integration** — LINE LIFF (OAuth) + Messaging API พร้อม error handling ที่ไม่ทำให้ operation หลักพัง (แจ้งเตือนล้มเหลว ≠ อนุมัติล้มเหลว)

## เริ่มใช้งาน

ดูรายละเอียดการติดตั้งและรันแต่ละส่วนได้ที่:
- [Backend README](./bbook_backend/README.md)
- [Frontend README](./bbook_frontend/README.md)
