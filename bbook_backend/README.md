# BBook Backend

REST API สำหรับระบบจองห้องประชุม เขียนด้วย [NestJS](https://nestjs.com/) + [Prisma](https://www.prisma.io/) + PostgreSQL

## Tech Stack

- NestJS 11
- Prisma 7 (driver adapter, ไม่มี Rust engine)
- PostgreSQL
- Passport JWT (access + refresh token)
- bcrypt (hash password)
- class-validator / class-transformer (validation)
- Swagger (API docs)

## โครงสร้างโมดูล

```
src/
├── auth/       # login, refresh, logout, JWT strategy, role guard
├── user/       # สมัครสมาชิก, ผูกบัญชี LINE
├── room/       # CRUD ห้องประชุม
├── book/       # จอง/แก้/ยกเลิก, conflict-check, workflow อนุมัติ
├── line/       # verify LINE ID token, ส่ง push message
├── common/     # decorator ที่ใช้ร่วมกัน (เช่น @CurrentUser)
└── prisma/     # PrismaService/PrismaModule
```

## ติดตั้ง

```bash
npm install
```

### ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root:

```
DATABASE_URL="postgresql://user:password@localhost:5432/bbook"

JWT_SECRET="<random string>"
JWT_REFRESH_SECRET="<random string, ต่างจาก JWT_SECRET>"

LINE_CHANNEL_ACCESS_TOKEN="<จาก LINE Messaging API channel>"
LINE_LOGIN_CHANNEL_ID="<จาก LINE Login channel>"

PORT=3001
```

### Migrate database

```bash
npx prisma migrate dev
npx prisma db seed
```

## รัน

```bash
npm run start:dev
```

Server รันที่ `http://localhost:3001`

## API Docs

เปิด Swagger UI ได้ที่ `http://localhost:3001/api` หลัง server รัน (มี "Authorize" ปุ่มสำหรับใส่ JWT ทดสอบ endpoint ที่ต้อง login)

## Business Logic ที่สำคัญ

### Conflict-check (การจองห้องซ้อนเวลา)

ตรวจสอบด้วยสูตร interval overlap มาตรฐาน:
```
existing.startTime < new.endTime  AND  existing.endTime > new.startTime
```
เช็คทั้งตอน `create` และ `update` (รวม merge ค่ากับ record เดิมกรณี partial update)

### Role-based Access

- `employee` — จอง/ดู/ยกเลิกการจองของตัวเองได้
- `admin` — ดูและอนุมัติ/ปฏิเสธการจองของทุกคนได้ (`GET /book/pending`, `PATCH /book/status/:id`)

### JWT Flow

- Access token อายุ 15 นาที
- Refresh token อายุ 7 วัน เก็บ hash (sha256) ไว้ใน DB — revoke ได้จริงผ่าน `/auth/logout`
- Rotate refresh token ทุกครั้งที่ `/auth/refresh` (ใช้ครั้งเดียว ใช้ซ้ำไม่ได้)
