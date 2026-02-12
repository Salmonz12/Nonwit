import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const room63 = [
  { studentCode: "07310", fullName: "ศุภฤกษ์ สุขพิสิฐ" },
  { studentCode: "07311", fullName: "กิตติพศ ชอบชื่น" },
  { studentCode: "07322", fullName: "สุธาธิษ ชนะพันธ์" },
  { studentCode: "07323", fullName: "กิตติพิชญ์ ชอบชื่น" },
  { studentCode: "07325", fullName: "ปัญญา ปารัตน์" },
  { studentCode: "07346", fullName: "พสธร กล้าหาญ" },
  { studentCode: "07353", fullName: "ภภวดล พิทักษ์ศิริ" },
  { studentCode: "07362", fullName: "วิทรภัทร ทรัพย์ชาวนา" },
  { studentCode: "07366", fullName: "มหาลาภ อินทรโสม" },
  { studentCode: "07396", fullName: "วิชดา เสือสไพร" },
  { studentCode: "07453", fullName: "ณัฐรินทร์ จำเริญสุขวัฒนา" },
  { studentCode: "07468", fullName: "กฤติศักดิ์ ชุมภู" },
  { studentCode: "07477", fullName: "วรสุกภา ทองภู" },
  { studentCode: "07490", fullName: "วิกรม เตชะอำมวงศ์" },
  { studentCode: "07555", fullName: "ณัฏฐวัช กลิ่นสกุล" },
  { studentCode: "07557", fullName: "ศิรินทร์ มินท้ว" },
  { studentCode: "07566", fullName: "คณิศร แก้วสด" },
  { studentCode: "07575", fullName: "ปภาวิน เพ็ชรอุด" },
  { studentCode: "07593", fullName: "ดุลยวัฒน์ วิริยานุรักษ์" },
  { studentCode: "10348", fullName: "ฐิติกร อาจศิริ" },
  { studentCode: "10350", fullName: "ณัฐภูมิ ชัยสิทธิ์" },
  { studentCode: "10351", fullName: "ณัฐรินทร์ สนจิต" },
  { studentCode: "10352", fullName: "ดุณภาพ ยุวภาคกุล" },
  { studentCode: "10353", fullName: "เนรมิต กานต์ศิริกุล" },
  { studentCode: "10355", fullName: "พิชญุตม์ พุมพิจ" },
  { studentCode: "10357", fullName: "ภัทรพล วาสันต์" },
  { studentCode: "10358", fullName: "รชต บูรพาชยานนท์" },
  { studentCode: "10359", fullName: "วัฒนพงษ์ วัฒนเศรษฐ์บำรุง" },
  { studentCode: "10361", fullName: "เบญจรัตน์ งามลำยวง" },
  { studentCode: "10362", fullName: "พิริยาภรณ์ ทองหอม" },
  { studentCode: "10363", fullName: "โสภิตา บุญไว" },
];

async function main() {
  for (const s of room63) {
    const [firstName, ...lastParts] = s.fullName.split(" ");
    const lastName = lastParts.join(" ");

    await prisma.student.upsert({
      where: { studentCode: s.studentCode },
      update: {
        firstName,
        lastName,
        roomNumber: 3, // ห้อง 6/3
      },
      create: {
        studentCode: s.studentCode,
        firstName,
        lastName,
        roomNumber: 3,
      },
    });
  }
}