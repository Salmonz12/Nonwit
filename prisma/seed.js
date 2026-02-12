require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

function splitName(fullName) {
  const trimmed = String(fullName || "").trim();
  const firstSpace = trimmed.indexOf(" ");
  if (firstSpace === -1) return { firstName: trimmed, lastName: null };
  return {
    firstName: trimmed.slice(0, firstSpace).trim(),
    lastName: trimmed.slice(firstSpace + 1).trim() || null,
  };
}

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
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL missing");

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const data = room63.map((x) => {
    const { firstName, lastName } = splitName(x.fullName);
    return {
      studentCode: x.studentCode,
      firstName,
      lastName,
      roomNumber: 3,
      hasPassword: false,
    };
  });

  const result = await prisma.student.createMany({
    data,
    skipDuplicates: true,
  });

  console.log("Seed room 6/3 done:", result);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
