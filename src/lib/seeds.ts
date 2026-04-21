// Seed data based on Iraqi HR laws

import type {
  Department,
  Employee,
  JobTitle,
  LeaveType,
  PenaltyType,
  CommendationType,
  SalaryGrade,
} from "./types";

export const SEED_DEPARTMENTS: Department[] = [
  { id: "d1", name: "القسم المالي", code: "FIN" },
  { id: "d2", name: "شعبة شؤون الموظفين", code: "HR" },
  { id: "d3", name: "قسم الرقابة الداخلية", code: "AUD" },
  { id: "d4", name: "المديرية العامة", code: "GEN" },
  { id: "d5", name: "القسم القانوني", code: "LEG" },
  { id: "d6", name: "قسم تكنولوجيا المعلومات", code: "IT" },
];

export const SEED_JOB_TITLES: JobTitle[] = [
  { id: "j1", name: "مدير عام", code: "DG" },
  { id: "j2", name: "مدير قسم", code: "DM" },
  { id: "j3", name: "رئيس شعبة", code: "DH" },
  { id: "j4", name: "موظف", code: "EMP" },
  { id: "j5", name: "مدرس مساعد", code: "AT" },
  { id: "j6", name: "أستاذ", code: "PR" },
  { id: "j7", name: "مهندس", code: "ENG" },
  { id: "j8", name: "محاسب", code: "ACC" },
];

// قانون الخدمة المدنية رقم 24 لسنة 1960 + قانون العمل رقم 37 لسنة 2015
export const SEED_LEAVE_TYPES: LeaveType[] = [
  { id: "lt1", name: "إجازة اعتيادية", code: "AL", category: "regular", daysPerYear: 36, paid: true, active: true, legalRef: "م.43 - قانون الخدمة المدنية 24/1960" },
  { id: "lt2", name: "إجازة مرضية", code: "SL", category: "sick", daysPerYear: 30, paid: true, active: true, legalRef: "م.46 - قانون الخدمة المدنية 24/1960" },
  { id: "lt3", name: "إجازة أمومة", code: "ML", category: "maternity", daysPerYear: 72, paid: true, active: true, legalRef: "م.83 - قانون العمل 37/2015" },
  { id: "lt4", name: "إجازة أبوة", code: "PL", category: "paternity", daysPerYear: 3, paid: true, active: true, legalRef: "تعليمات وزارة المالية" },
  { id: "lt5", name: "إجازة زواج", code: "MRL", category: "marriage", daysPerYear: 10, paid: true, active: true, legalRef: "تعليمات وزارة المالية" },
  { id: "lt6", name: "إجازة وفاة", code: "BL", category: "bereavement", daysPerYear: 7, paid: true, active: true, legalRef: "تعليمات وزارة المالية" },
  { id: "lt7", name: "إجازة الحج", code: "HL", category: "hajj", daysPerYear: 30, paid: true, active: true, legalRef: "م.49 - قانون الخدمة المدنية 24/1960" },
  { id: "lt8", name: "إجازة دراسية", code: "STL", category: "study", daysPerYear: 365, paid: true, active: true, legalRef: "قانون البعثات والزمالات الدراسية" },
  { id: "lt9", name: "إجازة بدون راتب", code: "UL", category: "unpaid", daysPerYear: 365, paid: false, active: true, legalRef: "م.51 - قانون الخدمة المدنية 24/1960" },
];

// قانون انضباط موظفي الدولة رقم 14 لسنة 1991
export const SEED_PENALTY_TYPES: PenaltyType[] = [
  { id: "p1", name: "لفت النظر", code: "WRN", severity: "light", promotionDelayMonths: 3, authority: "رئيس الدائرة", active: true, legalRef: "م.8/أولاً - قانون 14/1991" },
  { id: "p2", name: "الإنذار", code: "ADM", severity: "light", promotionDelayMonths: 6, authority: "رئيس الدائرة", active: true, legalRef: "م.8/ثانياً - قانون 14/1991" },
  { id: "p3", name: "قطع الراتب", code: "SDC", severity: "medium", promotionDelayMonths: 0, authority: "رئيس الدائرة", active: true, legalRef: "م.8/ثالثاً - قانون 14/1991" },
  { id: "p4", name: "التوبيخ", code: "REP", severity: "medium", promotionDelayMonths: 12, authority: "رئيس الدائرة", active: true, legalRef: "م.8/رابعاً - قانون 14/1991" },
  { id: "p5", name: "إنقاص الراتب", code: "SRD", severity: "severe", promotionDelayMonths: 24, authority: "الوزير المختص", active: true, legalRef: "م.8/خامساً - قانون 14/1991" },
  { id: "p6", name: "تنزيل الدرجة", code: "DEM", severity: "severe", promotionDelayMonths: 36, authority: "الوزير المختص", active: true, legalRef: "م.8/سادساً - قانون 14/1991" },
  { id: "p7", name: "الفصل", code: "DSM", severity: "extreme", promotionDelayMonths: 0, authority: "مجلس الانضباط", active: true, legalRef: "م.8/سابعاً - قانون 14/1991" },
  { id: "p8", name: "العزل", code: "TRM", severity: "extreme", promotionDelayMonths: 0, authority: "مجلس الانضباط", active: true, legalRef: "م.8/ثامناً - قانون 14/1991" },
];

// كتب الشكر - قانون انضباط موظفي الدولة رقم 14/1991 - المادة 21
export const SEED_COMMENDATIONS: CommendationType[] = [
  { id: "c1", name: "كتاب شكر رئيس الجمهورية", code: "PTH", level: "president", seniorityBonusMonths: 6, authority: "رئاسة الجمهورية", active: true },
  { id: "c2", name: "كتاب شكر رئيس الوزراء", code: "PMT", level: "pm", seniorityBonusMonths: 6, authority: "رئاسة الوزراء", active: true },
  { id: "c3", name: "كتاب شكر الوزير", code: "MTH", level: "minister", seniorityBonusMonths: 1, authority: "الوزير المختص", active: true },
  { id: "c4", name: "كتاب شكر المدير العام", code: "DGT", level: "department", seniorityBonusMonths: 1, authority: "المدير العام", active: true },
  { id: "c5", name: "شهادة تقديرية", code: "COA", level: "department", seniorityBonusMonths: 0, authority: "المدير العام", active: true },
  { id: "c6", name: "وسام", code: "MDL", level: "president", seniorityBonusMonths: 12, authority: "رئاسة الجمهورية", active: true },
];

// قانون رواتب موظفي الدولة رقم 22 لسنة 2008 - سلم الرواتب الرسمي (بآلاف الدنانير)
// المصدر: جدول سلم رواتب موظفي الدولة
export const SEED_SALARY: SalaryGrade[] = [
  { grade: 1,  stages: [910000, 930000, 950000, 970000, 990000, 1010000, 1030000, 1050000, 1070000, 1090000, 1110000], annualIncrement: 20000, yearsPerIncrement: 5 },
  { grade: 2,  stages: [723000, 740000, 757000, 774000, 791000, 808000,  825000,  842000,  859000,  876000,  893000],  annualIncrement: 17000, yearsPerIncrement: 5 },
  { grade: 3,  stages: [600000, 610000, 620000, 630000, 640000, 650000,  660000,  670000,  680000,  690000,  700000],  annualIncrement: 10000, yearsPerIncrement: 5 },
  { grade: 4,  stages: [509000, 517000, 525000, 533000, 541000, 549000,  557000,  565000,  573000,  581000,  589000],  annualIncrement: 8000,  yearsPerIncrement: 5 },
  { grade: 5,  stages: [429000, 435000, 441000, 447000, 453000, 459000,  465000,  471000,  477000,  483000,  489000],  annualIncrement: 6000,  yearsPerIncrement: 5 },
  { grade: 6,  stages: [362000, 368000, 374000, 380000, 386000, 392000,  398000,  404000,  410000,  416000,  422000],  annualIncrement: 6000,  yearsPerIncrement: 4 },
  { grade: 7,  stages: [296000, 302000, 308000, 314000, 320000, 326000,  332000,  338000,  344000,  350000,  356000],  annualIncrement: 6000,  yearsPerIncrement: 4 },
  { grade: 8,  stages: [260000, 263000, 266000, 269000, 272000, 275000,  278000,  281000,  284000,  287000,  290000],  annualIncrement: 3000,  yearsPerIncrement: 4 },
  { grade: 9,  stages: [210000, 213000, 216000, 219000, 222000, 225000,  228000,  231000,  234000,  237000,  240000],  annualIncrement: 3000,  yearsPerIncrement: 4 },
  { grade: 10, stages: [170000, 173000, 176000, 179000, 182000, 185000,  188000,  191000,  194000,  197000,  200000],  annualIncrement: 3000,  yearsPerIncrement: 4 },
];

const today = new Date();
const dt = (yearsAgo: number, m = 0, d = 1) => {
  const x = new Date(today.getFullYear() - yearsAgo, m, d);
  return x.toISOString().slice(0, 10);
};

export const SEED_EMPLOYEES: Employee[] = [
  { id: "e1", empNo: "EMP0001", fullName: "أحمد محمد علي العبيدي", nationalId: "19850101001", phone: "07901234567", birthDate: "1980-03-15", gender: "male", jobTitle: "مدير عام", departmentId: "d1", grade: 2, stage: 5, startDate: dt(13), lastIncrementDate: dt(1), lastPromotionDate: dt(4), status: "active", createdAt: dt(13) },
  { id: "e2", empNo: "EMP0002", fullName: "زينب سعد محمود الخزرجي", nationalId: "19880202002", phone: "07811234568", birthDate: "1985-07-22", gender: "female", jobTitle: "مدير قسم", departmentId: "d2", grade: 4, stage: 4, startDate: dt(11, 8), lastIncrementDate: dt(0, 6), lastPromotionDate: dt(3), status: "active", createdAt: dt(11) },
  { id: "e3", empNo: "EMP0003", fullName: "محمد عباس حسن الربيعي", nationalId: "19720303003", phone: "07701234569", birthDate: "1972-11-03", gender: "male", jobTitle: "مدرس مساعد", departmentId: "d3", grade: 6, stage: 6, startDate: dt(18, 5), lastIncrementDate: dt(0, 9), lastPromotionDate: dt(2), status: "active", createdAt: dt(18) },
  { id: "e4", empNo: "EMP0004", fullName: "مريم طالب عبد الطائي", nationalId: "19900404004", phone: "07901234570", birthDate: "1990-01-10", gender: "female", jobTitle: "رئيس شعبة", departmentId: "d3", grade: 6, stage: 2, startDate: dt(4, 11, 26), lastIncrementDate: dt(0), status: "active", createdAt: dt(4) },
  { id: "e5", empNo: "EMP0005", fullName: "عمر خالد رشيد السامرائي", nationalId: "19780505005", phone: "07811234571", birthDate: "1978-05-25", gender: "male", jobTitle: "أستاذ", departmentId: "d4", grade: 3, stage: 3, startDate: dt(15, 1), lastIncrementDate: dt(1, 1), lastPromotionDate: dt(5), status: "active", createdAt: dt(15) },
  { id: "e6", empNo: "EMP0006", fullName: "هدى علي حميد الأنصاري", nationalId: "19820606006", phone: "07701234572", birthDate: "1982-09-12", gender: "female", jobTitle: "موظف", departmentId: "d5", grade: 6, stage: 4, startDate: dt(15, 6), lastIncrementDate: dt(0, 7), status: "active", createdAt: dt(15) },
  { id: "e7", empNo: "EMP0007", fullName: "يوسف عادل صالح الكبيسي", nationalId: "19750707007", phone: "07901234573", birthDate: "1975-12-30", gender: "male", jobTitle: "مهندس", departmentId: "d3", grade: 8, stage: 7, startDate: dt(19, 8), lastIncrementDate: dt(0, 3), lastPromotionDate: dt(6), status: "active", createdAt: dt(19) },
  { id: "e8", empNo: "EMP0008", fullName: "أمل ناصر محمد الجنابي", nationalId: "19920808008", phone: "07811234574", birthDate: "1992-04-18", gender: "female", jobTitle: "محاسب", departmentId: "d3", grade: 6, stage: 3, startDate: dt(11, 6), lastIncrementDate: dt(0, 2), status: "active", createdAt: dt(11) },
  { id: "e9", empNo: "EMP0009", fullName: "حسن جاسم خضير الموسوي", nationalId: "19690909009", phone: "07701234575", birthDate: "1962-02-20", gender: "male", jobTitle: "مدير قسم", departmentId: "d4", grade: 3, stage: 8, startDate: dt(28), lastIncrementDate: dt(1), lastPromotionDate: dt(4), status: "active", createdAt: dt(28) },
  { id: "e10", empNo: "EMP0010", fullName: "سارة عماد فاضل التميمي", nationalId: "19951010010", phone: "07901234576", birthDate: "1995-08-08", gender: "female", jobTitle: "مهندس", departmentId: "d6", grade: 7, stage: 2, startDate: dt(3, 2), lastIncrementDate: dt(0, 4), status: "active", createdAt: dt(3) },
  { id: "e11", empNo: "EMP0011", fullName: "كرار نوري عبد الله الحسيني", nationalId: "19871111011", phone: "07811234577", birthDate: "1987-06-14", gender: "male", jobTitle: "موظف", departmentId: "d1", grade: 7, stage: 5, startDate: dt(9), lastIncrementDate: dt(0, 11), status: "active", createdAt: dt(9) },
  { id: "e12", empNo: "EMP0012", fullName: "فاطمة كاظم صبحي الزيدي", nationalId: "19891212012", phone: "07701234578", birthDate: "1989-10-05", gender: "female", jobTitle: "محاسب", departmentId: "d1", grade: 6, stage: 5, startDate: dt(8, 3), lastIncrementDate: dt(1, 2), status: "active", createdAt: dt(8) },
  { id: "e13", empNo: "EMP0013", fullName: "أنس سالم رحيم الدليمي", nationalId: "19831313013", phone: "07901234579", birthDate: "1983-11-22", gender: "male", jobTitle: "مدرس مساعد", departmentId: "d4", grade: 5, stage: 4, startDate: dt(12, 7), lastIncrementDate: dt(0, 5), lastPromotionDate: dt(3), status: "active", createdAt: dt(12) },
  { id: "e14", empNo: "EMP0014", fullName: "نور حيدر طالب القيسي", nationalId: "19911414014", phone: "07811234580", birthDate: "1991-03-30", gender: "female", jobTitle: "موظف", departmentId: "d5", grade: 7, stage: 3, startDate: dt(5, 9), lastIncrementDate: dt(0, 8), status: "active", createdAt: dt(5) },
  { id: "e15", empNo: "EMP0015", fullName: "علي مهدي حسن الشمري", nationalId: "19771515015", phone: "07701234581", birthDate: "1977-07-07", gender: "male", jobTitle: "أستاذ", departmentId: "d4", grade: 3, stage: 6, startDate: dt(20, 2), lastIncrementDate: dt(1), lastPromotionDate: dt(7), status: "active", createdAt: dt(20) },
  { id: "e16", empNo: "EMP0016", fullName: "رنا فؤاد إبراهيم الجبوري", nationalId: "19931616016", phone: "07901234582", birthDate: "1993-12-12", gender: "female", jobTitle: "مهندس", departmentId: "d6", grade: 7, stage: 1, startDate: dt(2, 5), lastIncrementDate: dt(0, 5), status: "active", createdAt: dt(2) },
  { id: "e17", empNo: "EMP0017", fullName: "مصطفى عبد الكريم الحلفي", nationalId: "19811717017", phone: "07811234583", birthDate: "1981-04-25", gender: "male", jobTitle: "رئيس شعبة", departmentId: "d2", grade: 5, stage: 5, startDate: dt(14), lastIncrementDate: dt(0, 1), lastPromotionDate: dt(4), status: "active", createdAt: dt(14) },
  { id: "e18", empNo: "EMP0018", fullName: "إسراء ثامر عبد القادر", nationalId: "19941818018", phone: "07701234584", birthDate: "1994-09-19", gender: "female", jobTitle: "موظف", departmentId: "d2", grade: 7, stage: 2, startDate: dt(4, 1), lastIncrementDate: dt(0, 6), status: "active", createdAt: dt(4) },
  { id: "e19", empNo: "EMP0019", fullName: "حيدر زهير مالك العبادي", nationalId: "19861919019", phone: "07901234585", birthDate: "1986-02-28", gender: "male", jobTitle: "محاسب", departmentId: "d1", grade: 6, stage: 6, startDate: dt(10, 4), lastIncrementDate: dt(1, 1), lastPromotionDate: dt(3), status: "active", createdAt: dt(10) },
  { id: "e20", empNo: "EMP0020", fullName: "زهراء مازن قاسم الكناني", nationalId: "19962020020", phone: "07811234586", birthDate: "1996-06-02", gender: "female", jobTitle: "موظف", departmentId: "d3", grade: 8, stage: 1, startDate: dt(1, 8), lastIncrementDate: dt(0, 2), status: "active", createdAt: dt(1) },
];
