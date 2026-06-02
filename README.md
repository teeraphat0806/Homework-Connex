# Homework-Connex

คู่มือนี้สรุปภาพรวม และขั้นตอนการตั้งค่า/รันโปรเจค Homework-Connex

## ภาพรวม

โปรเจคนี้ประกอบด้วยส่วนหลักดังนี้:
- Frontend: โฟลเดอร์ [ClientApp](ClientApp) — แอพ Angular (UI)
- Domain: โฟลเดอร์ [Homework.Domain](Homework.Domain) — โมเดล, context และตรรกะธุรกิจ
- Service: โฟลเดอร์ [Homework.Service](Homework.Service) — การใช้งาน service ต่างๆ
- Backend / API: โฟลเดอร์ [Web.Homework](Web.Homework) — ASP.NET Core Web API

โครงสร้างโดยย่ออยู่ที่รูทของ repository สามารถดูรายละเอียดเพิ่มเติมในแต่ละโฟลเดอร์

## สิ่งที่ต้องมี (Prerequisites)

- .NET SDK (แนะนำ 6.0 หรือใหม่กว่า)
- Node.js และ `npm` (แนะนำ Node 14+)
- PostgreSQL (ถ้าใช้ฐานข้อมูลจริง — project มี `postgresContext`)

## ตั้งค่าและรัน (Developer setup)

1) Backend (API)

 - เข้าไปที่โฟลเดอร์ `Web.Homework` และติดตั้ง/รัน:

```powershell
cd Web.Homework
dotnet restore
dotnet build
dotnet run
```

 - แอพจะแสดง URL ที่ใช้งาน (เช่น `http://localhost:5000` หรือ `https://localhost:5001`) ในคอนโซล ขึ้นกับการตั้งค่า

2) Service / Domain

 - โค้ดธุรกิจและ context ของ DB อยู่ใน [Homework.Domain](Homework.Domain) และบริการใน [Homework.Service](Homework.Service)
 - ถ้ามีการใช้ migrations / database setup ให้แก้ไข connection string ในไฟล์การตั้งค่า (ดูด้านล่าง) และรันคำสั่ง EF Core ตามปกติ

3) Frontend (ClientApp)

 - เข้าไปที่โฟลเดอร์ `ClientApp` แล้วติดตั้ง dependency และรันเดวิวเซิร์ฟเวอร์:

```bash
cd ClientApp
npm install
npm start
```

 - หากเป็นแอพ Angular แบบมาตรฐาน คำสั่งการพัฒนาอาจเป็น `ng serve` หรือ `npm run start` ขึ้นกับ `package.json` (ดู [ClientApp/package.json](ClientApp/package.json))

## การตั้งค่า (Configuration)

- ค่าการตั้งค่าแอพของ backend อยู่ใน [Web.Homework/appsettings.Development.json](Web.Homework/appsettings.Development.json) และ `appsettings.json`
- Connection string ของฐานข้อมูล และการตั้งค่าอื่นๆ อาจถูกกำหนดจาก environment variable หรือไฟล์คอนฟิก
- โค้ด context ของ PostgreSQL อยู่ที่ [Homework.Domain/Models/postgresContext.cs](Homework.Domain/Models/postgresContext.cs)

## ฐานข้อมูล

- โปรเจคมีการอ้างอิง `postgresContext` ซึ่งบ่งชี้การใช้ PostgreSQL หากต้องใช้ DB จริง ให้สร้างฐานข้อมูลและอัพเดต connection string ในไฟล์คอนฟิกหรือ environment

## การทดสอบ

- ตรวจสอบว่ามีสคริปต์การทดสอบในแต่ละโปรเจค (`ClientApp` อาจมี unit test ของ Angular, backend อาจมี xUnit)
- ตัวอย่างรันเทสต์สำหรับ .NET:

```powershell
dotnet test
```

สำหรับ `ClientApp` ให้ตรวจสอบ `package.json` ว่ามีสคริปต์ `test` หรือไม่

## การดีบัก

- สำหรับ backend ใช้ `dotnet run` แล้วต่อ debugger จาก IDE (Visual Studio / VS Code) ตามปกติ
- สำหรับ frontend ใช้ `npm start` แล้วเปิด devtools ในเบราว์เซอร์

## Contributing

- ยินดีรับ PR และ issue — โปรดอธิบายปัญหา/ฟีเจอร์อย่างชัดเจน

## เพิ่มเติม / หมายเหตุ

- ไฟล์สำคัญที่ควรเปิดดู: [ClientApp/package.json](ClientApp/package.json), [Web.Homework/Program.cs](Web.Homework/Program.cs), [Homework.Domain/Models/postgresContext.cs](Homework.Domain/Models/postgresContext.cs)

---


