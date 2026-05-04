// HR calculation engine grounded in Iraqi law
// References:
// - قانون الخدمة المدنية رقم 24 لسنة 1960
// - قانون الملاك رقم 25 لسنة 1960
// - قانون رواتب موظفي الدولة رقم 22 لسنة 2008
// - قانون انضباط موظفي الدولة رقم 14 لسنة 1991
// - قانون التقاعد الموحد رقم 9 لسنة 2014
// - قانون العمل رقم 37 لسنة 2015

import type { Employee, PenaltyRecord, PenaltyType, CommendationRecord, CommendationType, SalaryGrade } from "./types";

const MS_PER_DAY = 86400000;

export function diffMonths(from: string | Date, to: string | Date = new Date()): number {
  const a = new Date(from);
  const b = new Date(to);
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

export function diffYearsMonths(from: string | Date, to: string | Date = new Date()) {
  const months = diffMonths(from, to);
  return { years: Math.floor(months / 12), months: months % 12, totalMonths: months };
}

export function formatYM(from: string | Date, to: string | Date = new Date()): string {
  const { years, months } = diffYearsMonths(from, to);
  if (years === 0) return `${months} شهر`;
  if (months === 0) return `${years} سنة`;
  return `${years} سنة و ${months} شهر`;
}

// قانون التقاعد رقم 9/2014 - سن التقاعد القانوني 63 (مع إمكانية التمديد إلى 65 لذوي الشهادات العليا)
export const RETIREMENT_AGE = 63;

export function ageInYears(birthDate: string): number {
  const b = new Date(birthDate);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

export function monthsToRetirement(birthDate: string): number {
  const b = new Date(birthDate);
  const retire = new Date(b.getFullYear() + RETIREMENT_AGE, b.getMonth(), b.getDate());
  return Math.max(0, diffMonths(new Date(), retire));
}

export function isNearRetirement(birthDate: string, monthsThreshold = 12): boolean {
  return monthsToRetirement(birthDate) <= monthsThreshold && monthsToRetirement(birthDate) >= 0;
}

// قانون رواتب موظفي الدولة 22/2008 - العلاوة السنوية كل سنة مالية
export interface IncrementStatus {
  due: boolean;
  monthsSinceLast: number;
  monthsRemaining: number;
  nextDate: string;
  delayMonths: number;  // تأخير بسبب العقوبات
  bonusMonths: number;  // تقديم بسبب كتب الشكر
  requiredMonths: number;
  effectiveServedMonths: number;
}

export function incrementStatus(
  emp: Employee,
  penalties: PenaltyRecord[] = [],
  penaltyTypes: PenaltyType[] = [],
  commendations: CommendationRecord[] = [],
  commendationTypes: CommendationType[] = [],
): IncrementStatus {
  const last = emp.lastIncrementDate || emp.startDate;
  const lastDate = new Date(last);
  const monthsSinceLast = diffMonths(lastDate, new Date());

  // تأخير من العقوبات السارية منذ آخر علاوة (قانون الانضباط 14/1991)
  const delayMonths = penalties
    .filter((p) => p.employeeId === emp.id && p.active && new Date(p.date) >= lastDate)
    .reduce((sum, p) => {
      const t = penaltyTypes.find((x) => x.id === p.penaltyTypeId);
      return sum + (t?.promotionDelayMonths ?? 0);
    }, 0);

  // تقديم من كتب الشكر منذ آخر علاوة (المادة 21 - قانون 14/1991)
  // قيد: لا يُحتسب أكثر من 3 كتب شكر في السنة الواحدة لكل موظف
  const bonusMonths = countLimitedCommendationBonus(
    commendations.filter((c) => c.employeeId === emp.id && new Date(c.date) >= lastDate),
    commendationTypes,
  );

  const requiredMonths = 12 + delayMonths - bonusMonths;
  const effectiveServedMonths = monthsSinceLast;
  const monthsRemaining = Math.max(0, requiredMonths - effectiveServedMonths);

  const next = new Date(lastDate);
  next.setMonth(next.getMonth() + requiredMonths);

  return {
    due: effectiveServedMonths >= requiredMonths,
    monthsSinceLast,
    monthsRemaining,
    nextDate: next.toISOString().slice(0, 10),
    delayMonths,
    bonusMonths,
    requiredMonths,
    effectiveServedMonths,
  };
}

// قانون الملاك 25/1960 - الترقية بين الدرجات
// المدد المعتمدة: درجة عاشرة → خامسة: 4 سنوات، رابعة → ثالثة: 5 سنوات، ثالثة → ثانية: 6 سنوات، ثانية → أولى: 7 سنوات
const PROMOTION_YEARS_BY_GRADE: Record<number, number> = {
  10: 4, 9: 4, 8: 4, 7: 4, 6: 4, 5: 4,
  4: 5, 3: 6, 2: 7, 1: 8,
};

export interface PromotionStatus {
  due: boolean;
  requiredMonths: number;
  servedMonths: number;
  monthsRemaining: number;
  delayMonths: number; // due to penalties
  bonusMonths: number; // due to commendations
  effectiveServedMonths: number;
}

export function promotionStatus(
  emp: Employee,
  penalties: PenaltyRecord[],
  penaltyTypes: PenaltyType[],
  commendations: CommendationRecord[],
  commendationTypes: CommendationType[],
): PromotionStatus {
  const since = emp.lastPromotionDate || emp.startDate;
  const servedMonths = diffMonths(since, new Date());

  // sum delays from active penalties since last promotion
  const delayMonths = penalties
    .filter((p) => p.employeeId === emp.id && p.active && new Date(p.date) >= new Date(since))
    .reduce((sum, p) => {
      const t = penaltyTypes.find((x) => x.id === p.penaltyTypeId);
      return sum + (t?.promotionDelayMonths ?? 0);
    }, 0);

  // bonus from commendations since last promotion (المادة 21 - قانون 14/1991)
  const bonusMonths = commendations
    .filter((c) => c.employeeId === emp.id && new Date(c.date) >= new Date(since))
    .reduce((sum, c) => {
      const t = commendationTypes.find((x) => x.id === c.commendationTypeId);
      return sum + (t?.seniorityBonusMonths ?? 0);
    }, 0);

  const requiredYears = PROMOTION_YEARS_BY_GRADE[emp.grade] ?? 4;
  const requiredMonths = requiredYears * 12 + delayMonths - bonusMonths;
  const effectiveServedMonths = servedMonths;
  const monthsRemaining = Math.max(0, requiredMonths - effectiveServedMonths);

  return {
    due: emp.grade > 1 && effectiveServedMonths >= requiredMonths,
    requiredMonths,
    servedMonths,
    monthsRemaining,
    delayMonths,
    bonusMonths,
    effectiveServedMonths,
  };
}

// Salary calc per قانون 22/2008
export function baseSalary(emp: Employee, salary: SalaryGrade[]): number {
  const g = salary.find((s) => s.grade === emp.grade);
  if (!g) return 0;
  const idx = Math.max(0, Math.min(emp.stage - 1, g.stages.length - 1));
  return g.stages[idx];
}

export function formatIQD(n: number): string {
  return n.toLocaleString("ar-IQ") + " د.ع";
}

export function formatDateAR(d: string | Date): string {
  return new Date(d).toLocaleDateString("ar-IQ-u-ca-gregory", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

export { MS_PER_DAY };
