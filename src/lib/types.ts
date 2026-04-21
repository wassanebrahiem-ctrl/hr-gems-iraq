// Domain types - Iraqi HR system

export type EmployeeStatus =
  | "active"          // مستمر
  | "seconded"        // منسب
  | "retired"         // متقاعد
  | "dismissed"       // مفصول
  | "assigned"        // تكليف
  | "contract_ended"  // انهاء عقد
  | "deceased"        // متوفي
  | "resigned";       // مستقيل

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "مستمر",
  seconded: "منسب",
  retired: "متقاعد",
  dismissed: "مفصول",
  assigned: "تكليف",
  contract_ended: "انهاء عقد",
  deceased: "متوفي",
  resigned: "مستقيل",
};

export interface Employee {
  id: string;
  empNo: string; // الرقم الوظيفي
  fullName: string; // الاسم الرباعي
  nationalId: string; // رقم الهوية
  phone: string;
  birthDate: string; // YYYY-MM-DD
  gender: "male" | "female";
  jobTitle: string; // العنوان الوظيفي
  departmentId: string; // القسم
  grade: number; // الدرجة (1-10)
  stage: number; // المرحلة داخل الدرجة (1-10)
  startDate: string; // تاريخ المباشرة
  lastIncrementDate?: string; // آخر علاوة
  lastPromotionDate?: string; // آخر ترقية
  status: EmployeeStatus;
  notes?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface JobTitle {
  id: string;
  name: string;
  code: string;
}

export type LeaveCategory =
  | "regular"      // اعتيادية
  | "sick"         // مرضية
  | "maternity"    // أمومة
  | "paternity"    // أبوة
  | "marriage"     // زواج
  | "bereavement"  // وفاة
  | "hajj"         // حج
  | "study"        // دراسية
  | "unpaid";      // بدون راتب

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  category: LeaveCategory;
  daysPerYear: number;
  paid: boolean;
  active: boolean;
  legalRef: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type PenaltySeverity = "light" | "medium" | "severe" | "extreme";

export interface PenaltyType {
  id: string;
  name: string;
  code: string;
  severity: PenaltySeverity;
  promotionDelayMonths: number; // تأخير الترقية بالأشهر
  authority: string; // الجهة المختصة
  active: boolean;
  legalRef: string;
}

export interface PenaltyRecord {
  id: string;
  employeeId: string;
  penaltyTypeId: string;
  date: string;
  reason: string;
  active: boolean;
  createdAt: string;
}

export type CommendationLevel = "department" | "minister" | "pm" | "president";

export interface CommendationType {
  id: string;
  name: string;
  code: string;
  level: CommendationLevel;
  seniorityBonusMonths: number; // القدم الممنوح
  authority: string;
  active: boolean;
}

export interface CommendationRecord {
  id: string;
  employeeId: string;
  commendationTypeId: string;
  date: string;
  reason: string;
  createdAt: string;
}

export interface SalaryGrade {
  grade: number; // 1-10
  stages: number[]; // base salary per stage (1..11)
  annualIncrement: number; // العلاوة السنوية (ألف د.ع)
  yearsPerIncrement: number; // عدد سنوات الخدمة لكل علاوة
}

// ============ Employee Dossier (الملف الشخصي) ============

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type EducationLevel =
  | "primary" | "intermediate" | "preparatory"
  | "diploma" | "bachelor" | "higher_diploma" | "master" | "phd";

export interface EmployeeProfile {
  employeeId: string;
  // Personal
  motherName?: string;
  maritalStatus?: MaritalStatus;
  childrenCount?: number;
  bloodType?: BloodType;
  religion?: string;
  nationality?: string;
  // Identity / civil
  civilStatusId?: string;     // رقم البطاقة المدنية
  passportNo?: string;
  residenceCardNo?: string;   // بطاقة السكن
  // Address
  governorate?: string;
  district?: string;
  address?: string;
  // Contact
  altPhone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  // Education
  educationLevel?: EducationLevel;
  specialization?: string;
  graduationYear?: number;
  university?: string;
  // Bank
  bankName?: string;
  bankAccount?: string;
  iban?: string;
  // Misc
  avatarDataUrl?: string;     // base64 photo
  bio?: string;
  updatedAt: string;
}

export type DocumentCategory =
  | "id"           // البطاقة الموحدة / الجنسية
  | "civil"        // الأحوال المدنية
  | "residence"    // بطاقة السكن
  | "passport"     // جواز السفر
  | "education"    // شهادات دراسية
  | "appointment"  // أمر المباشرة / التعيين
  | "promotion"    // أوامر الترقية
  | "increment"    // أوامر العلاوة
  | "leave"        // إجازات
  | "penalty"      // عقوبات
  | "commendation" // كتب شكر
  | "medical"      // تقارير طبية
  | "contract"     // عقود
  | "other";       // أخرى

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  category: DocumentCategory;
  title: string;
  fileName: string;
  mimeType: string;
  size: number;        // bytes
  dataUrl: string;     // base64
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}
