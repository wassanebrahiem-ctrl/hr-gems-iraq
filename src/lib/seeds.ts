// Seed data based on Iraqi HR laws

import type {
  Department,
  Employee,
  JobTitle,
  Position,
  LeaveType,
  PenaltyType,
  CommendationType,
  SalaryGrade,
} from "./types";

// المناصب الإدارية - منفصلة عن العناوين الوظيفية
export const SEED_POSITIONS: Position[] = [
  { id: "p_dg",   name: "مدير عام",            code: "DG",   level: "general_manager" },
  { id: "p_adg",  name: "معاون مدير عام",      code: "ADG",  level: "general_manager" },
  { id: "p_dept", name: "مدير قسم",            code: "DEPT", level: "department" },
  { id: "p_adept",name: "معاون مدير قسم",      code: "ADEPT",level: "department" },
  { id: "p_div",  name: "مسؤول شعبة",          code: "DIV",  level: "division" },
  { id: "p_adiv", name: "معاون مسؤول شعبة",    code: "ADIV", level: "division" },
  { id: "p_unit", name: "مسؤول وحدة",          code: "UNIT", level: "unit" },
  { id: "p_team", name: "مسؤول فريق عمل",      code: "TEAM", level: "unit" },
  { id: "p_sec",  name: "مقرر / سكرتير قسم",   code: "SEC",  level: "other" },
];


export const SEED_DEPARTMENTS: Department[] = [
  { id: "d1", name: "القسم المالي", code: "FIN" },
  { id: "d2", name: "شعبة شؤون الموظفين", code: "HR" },
  { id: "d3", name: "قسم الرقابة الداخلية", code: "AUD" },
  { id: "d4", name: "المديرية العامة", code: "GEN" },
  { id: "d5", name: "القسم القانوني", code: "LEG" },
  { id: "d6", name: "قسم تكنولوجيا المعلومات", code: "IT" },
];

// قانون الخدمة المدنية رقم 24/1960 + قانون الملاك رقم 25/1960 - السلم الوظيفي العراقي الكامل
export const SEED_JOB_TITLES: JobTitle[] = [
  // الإدارة العليا
  { id: "j_dg",  name: "مدير عام", code: "DG", defaultGrade: 1, category: "الإدارة العليا" },

  // 1- الوظائف الهندسية
  { id: "j_eng_1", name: "خبير (هندسي)", code: "ENG-EXP", defaultGrade: 1, category: "الوظائف الهندسية" },
  { id: "j_eng_2", name: "رئيس مهندسين أقدم", code: "ENG-CSR", defaultGrade: 2, category: "الوظائف الهندسية" },
  { id: "j_eng_3", name: "رئيس مهندسين", code: "ENG-CH", defaultGrade: 3, category: "الوظائف الهندسية" },
  { id: "j_eng_4", name: "معاون رئيس مهندسين", code: "ENG-DCH", defaultGrade: 4, category: "الوظائف الهندسية" },
  { id: "j_eng_5", name: "مهندس أقدم", code: "ENG-SR", defaultGrade: 5, category: "الوظائف الهندسية" },
  { id: "j_eng_6", name: "مهندس", code: "ENG", defaultGrade: 6, category: "الوظائف الهندسية" },
  { id: "j_eng_7", name: "معاون مهندس", code: "ENG-AST", defaultGrade: 7, category: "الوظائف الهندسية" },

  // 2- الوظائف القانونية
  { id: "j_law_1", name: "مستشار قانوني في الوزارة", code: "LAW-MIN", defaultGrade: 1, category: "الوظائف القانونية" },
  { id: "j_law_2", name: "مستشار قانوني مساعد", code: "LAW-AC", defaultGrade: 2, category: "الوظائف القانونية" },
  { id: "j_law_3", name: "مشاور قانوني أقدم", code: "LAW-SC", defaultGrade: 3, category: "الوظائف القانونية" },
  { id: "j_law_4", name: "مشاور قانوني", code: "LAW-C", defaultGrade: 4, category: "الوظائف القانونية" },
  { id: "j_law_5", name: "مشاور قانوني مساعد", code: "LAW-AS", defaultGrade: 5, category: "الوظائف القانونية" },
  { id: "j_law_6", name: "قانوني", code: "LAW", defaultGrade: 6, category: "الوظائف القانونية" },
  { id: "j_law_7", name: "معاون قانوني", code: "LAW-AST", defaultGrade: 7, category: "الوظائف القانونية" },

  // 3- المبرمجون
  { id: "j_pg_1", name: "مدير تنفيذي (مبرمجون)", code: "PG-EXEC", defaultGrade: 1, category: "الحاسبات - مبرمجون" },
  { id: "j_pg_2", name: "رئيس مبرمجين أقدم", code: "PG-CSR", defaultGrade: 2, category: "الحاسبات - مبرمجون" },
  { id: "j_pg_3", name: "رئيس مبرمجين", code: "PG-CH", defaultGrade: 3, category: "الحاسبات - مبرمجون" },
  { id: "j_pg_4", name: "معاون رئيس مبرمجين", code: "PG-DCH", defaultGrade: 4, category: "الحاسبات - مبرمجون" },
  { id: "j_pg_5", name: "مبرمج أقدم", code: "PG-SR", defaultGrade: 5, category: "الحاسبات - مبرمجون" },
  { id: "j_pg_6", name: "مبرمج", code: "PG", defaultGrade: 6, category: "الحاسبات - مبرمجون" },
  { id: "j_pg_7", name: "معاون مبرمج", code: "PG-AST", defaultGrade: 7, category: "الحاسبات - مبرمجون" },

  // 4- اختصاصي نظم ومعلومات
  { id: "j_is_2", name: "رئيس اختصاصيي نظم ومعلومات أقدم", code: "IS-CSR", defaultGrade: 2, category: "الحاسبات - نظم ومعلومات" },
  { id: "j_is_3", name: "رئيس اختصاصيي نظم ومعلومات", code: "IS-CH", defaultGrade: 3, category: "الحاسبات - نظم ومعلومات" },
  { id: "j_is_4", name: "معاون رئيس اختصاصيي نظم ومعلومات", code: "IS-DCH", defaultGrade: 4, category: "الحاسبات - نظم ومعلومات" },
  { id: "j_is_5", name: "اختصاصي نظم ومعلومات أقدم", code: "IS-SR", defaultGrade: 5, category: "الحاسبات - نظم ومعلومات" },
  { id: "j_is_6", name: "اختصاصي نظم ومعلومات", code: "IS", defaultGrade: 6, category: "الحاسبات - نظم ومعلومات" },
  { id: "j_is_7", name: "معاون اختصاصي نظم ومعلومات", code: "IS-AST", defaultGrade: 7, category: "الحاسبات - نظم ومعلومات" },

  // 5- مشغلو الحاسبة
  { id: "j_op_5", name: "رئيس مشغلي حاسبة", code: "OP-CH", defaultGrade: 5, category: "الحاسبات - مشغلون" },
  { id: "j_op_6", name: "مشغل حاسبة أقدم", code: "OP-SR", defaultGrade: 6, category: "الحاسبات - مشغلون" },
  { id: "j_op_7", name: "مشغل حاسبة", code: "OP", defaultGrade: 7, category: "الحاسبات - مشغلون" },

  // 6- الإحصائيون
  { id: "j_st_2", name: "رئيس إحصائيين أقدم", code: "ST-CSR", defaultGrade: 2, category: "الوظائف الإحصائية" },
  { id: "j_st_3", name: "رئيس إحصائيين", code: "ST-CH", defaultGrade: 3, category: "الوظائف الإحصائية" },
  { id: "j_st_4", name: "معاون رئيس إحصائيين", code: "ST-DCH", defaultGrade: 4, category: "الوظائف الإحصائية" },
  { id: "j_st_5", name: "إحصائي أقدم", code: "ST-SR", defaultGrade: 5, category: "الوظائف الإحصائية" },
  { id: "j_st_6", name: "إحصائي", code: "ST", defaultGrade: 6, category: "الوظائف الإحصائية" },
  { id: "j_st_7", name: "معاون إحصائي", code: "ST-AST", defaultGrade: 7, category: "الوظائف الإحصائية" },

  // 7- الكيميائيون
  { id: "j_ch_2", name: "رئيس كيمياويين أقدم", code: "CH-CSR", defaultGrade: 2, category: "الكيميائيون" },
  { id: "j_ch_3", name: "رئيس كيمياويين", code: "CH-CH", defaultGrade: 3, category: "الكيميائيون" },
  { id: "j_ch_4", name: "معاون رئيس كيمياويين", code: "CH-DCH", defaultGrade: 4, category: "الكيميائيون" },
  { id: "j_ch_5", name: "كيمياوي أقدم", code: "CH-SR", defaultGrade: 5, category: "الكيميائيون" },
  { id: "j_ch_6", name: "كيمياوي", code: "CH", defaultGrade: 6, category: "الكيميائيون" },
  { id: "j_ch_7", name: "معاون كيمياوي", code: "CH-AST", defaultGrade: 7, category: "الكيميائيون" },

  // 8- الفيزيائيون
  { id: "j_ph_2", name: "رئيس فيزياويين أقدم", code: "PH-CSR", defaultGrade: 2, category: "الفيزيائيون" },
  { id: "j_ph_3", name: "رئيس فيزياويين", code: "PH-CH", defaultGrade: 3, category: "الفيزيائيون" },
  { id: "j_ph_4", name: "معاون رئيس فيزياويين", code: "PH-DCH", defaultGrade: 4, category: "الفيزيائيون" },
  { id: "j_ph_5", name: "فيزياوي أقدم", code: "PH-SR", defaultGrade: 5, category: "الفيزيائيون" },
  { id: "j_ph_6", name: "فيزياوي", code: "PH", defaultGrade: 6, category: "الفيزيائيون" },
  { id: "j_ph_7", name: "معاون فيزياوي", code: "PH-AST", defaultGrade: 7, category: "الفيزيائيون" },

  // 9- المترجمون
  { id: "j_tr_2", name: "رئيس مترجمين أقدم", code: "TR-CSR", defaultGrade: 2, category: "المترجمون" },
  { id: "j_tr_3", name: "رئيس مترجمين", code: "TR-CH", defaultGrade: 3, category: "المترجمون" },
  { id: "j_tr_4", name: "معاون رئيس مترجمين", code: "TR-DCH", defaultGrade: 4, category: "المترجمون" },
  { id: "j_tr_5", name: "مترجم أقدم", code: "TR-SR", defaultGrade: 5, category: "المترجمون" },
  { id: "j_tr_6", name: "مترجم", code: "TR", defaultGrade: 6, category: "المترجمون" },
  { id: "j_tr_7", name: "معاون مترجم", code: "TR-AST", defaultGrade: 7, category: "المترجمون" },

  // 10- الوظائف الإدارية
  { id: "j_ad_1", name: "خبير / معاون مدير عام", code: "AD-EXP", defaultGrade: 1, category: "الوظائف الإدارية" },
  { id: "j_ad_2", name: "مدير أقدم", code: "AD-SDR", defaultGrade: 2, category: "الوظائف الإدارية" },
  { id: "j_ad_3", name: "مدير", code: "AD-DR", defaultGrade: 3, category: "الوظائف الإدارية" },
  { id: "j_ad_4", name: "معاون مدير", code: "AD-DDR", defaultGrade: 4, category: "الوظائف الإدارية" },
  { id: "j_ad_5", name: "رئيس ملاحظين", code: "AD-CO", defaultGrade: 5, category: "الوظائف الإدارية" },
  { id: "j_ad_6", name: "ملاحظ", code: "AD-OB", defaultGrade: 6, category: "الوظائف الإدارية" },
  { id: "j_ad_7", name: "معاون ملاحظ", code: "AD-AOB", defaultGrade: 7, category: "الوظائف الإدارية" },
  { id: "j_ad_8", name: "كاتب", code: "AD-CL", defaultGrade: 8, category: "الوظائف الإدارية" },

  // 11- الوظائف الفنية
  { id: "j_tc_2", name: "مدير فني أقدم", code: "TC-SDR", defaultGrade: 2, category: "الوظائف الفنية" },
  { id: "j_tc_3", name: "مدير فني", code: "TC-DR", defaultGrade: 3, category: "الوظائف الفنية" },
  { id: "j_tc_4", name: "معاون مدير فني", code: "TC-DDR", defaultGrade: 4, category: "الوظائف الفنية" },
  { id: "j_tc_5", name: "رئيس ملاحظين فنيين", code: "TC-CO", defaultGrade: 5, category: "الوظائف الفنية" },
  { id: "j_tc_6", name: "ملاحظ فني", code: "TC-OB", defaultGrade: 6, category: "الوظائف الفنية" },
  { id: "j_tc_7", name: "معاون ملاحظ فني", code: "TC-AOB", defaultGrade: 7, category: "الوظائف الفنية" },
  { id: "j_tc_8", name: "فني", code: "TC", defaultGrade: 8, category: "الوظائف الفنية" },

  // 12- الوظائف الحسابية
  { id: "j_ac_1", name: "خبير (حسابات)", code: "AC-EXP", defaultGrade: 1, category: "الوظائف الحسابية" },
  { id: "j_ac_2", name: "مدير حسابات أقدم", code: "AC-SDR", defaultGrade: 2, category: "الوظائف الحسابية" },
  { id: "j_ac_3", name: "مدير حسابات", code: "AC-DR", defaultGrade: 3, category: "الوظائف الحسابية" },
  { id: "j_ac_4", name: "معاون مدير حسابات", code: "AC-DDR", defaultGrade: 4, category: "الوظائف الحسابية" },
  { id: "j_ac_5", name: "محاسب أقدم", code: "AC-SR", defaultGrade: 5, category: "الوظائف الحسابية" },
  { id: "j_ac_6", name: "محاسب", code: "AC", defaultGrade: 6, category: "الوظائف الحسابية" },
  { id: "j_ac_7", name: "معاون محاسب", code: "AC-AST", defaultGrade: 7, category: "الوظائف الحسابية" },
  { id: "j_ac_8", name: "كاتب حسابات", code: "AC-CL", defaultGrade: 8, category: "الوظائف الحسابية" },

  // 13- الوظائف التدقيقية
  { id: "j_au_1", name: "خبير (تدقيق)", code: "AU-EXP", defaultGrade: 1, category: "الوظائف التدقيقية" },
  { id: "j_au_2", name: "مدير تدقيق أقدم", code: "AU-SDR", defaultGrade: 2, category: "الوظائف التدقيقية" },
  { id: "j_au_3", name: "مدير تدقيق", code: "AU-DR", defaultGrade: 3, category: "الوظائف التدقيقية" },
  { id: "j_au_4", name: "معاون مدير تدقيق", code: "AU-DDR", defaultGrade: 4, category: "الوظائف التدقيقية" },
  { id: "j_au_5", name: "مدقق أقدم", code: "AU-SR", defaultGrade: 5, category: "الوظائف التدقيقية" },
  { id: "j_au_6", name: "مدقق", code: "AU", defaultGrade: 6, category: "الوظائف التدقيقية" },
  { id: "j_au_7", name: "معاون مدقق", code: "AU-AST", defaultGrade: 7, category: "الوظائف التدقيقية" },
  { id: "j_au_8", name: "كاتب تدقيق", code: "AU-CL", defaultGrade: 8, category: "الوظائف التدقيقية" },

  // 14- وظائف المخازن
  { id: "j_st2_1", name: "خبير (مخازن)", code: "WH-EXP", defaultGrade: 1, category: "وظائف المخازن" },
  { id: "j_st2_2", name: "مدير مخازن أقدم", code: "WH-SDR", defaultGrade: 2, category: "وظائف المخازن" },
  { id: "j_st2_3", name: "مدير مخازن", code: "WH-DR", defaultGrade: 3, category: "وظائف المخازن" },
  { id: "j_st2_4", name: "معاون مدير مخازن", code: "WH-DDR", defaultGrade: 4, category: "وظائف المخازن" },
  { id: "j_st2_5", name: "أمين مخزن أقدم", code: "WH-SR", defaultGrade: 5, category: "وظائف المخازن" },
  { id: "j_st2_6", name: "أمين مخزن", code: "WH", defaultGrade: 6, category: "وظائف المخازن" },
  { id: "j_st2_7", name: "معاون أمين مخزن", code: "WH-AST", defaultGrade: 7, category: "وظائف المخازن" },
  { id: "j_st2_8", name: "كاتب مخزن", code: "WH-CL", defaultGrade: 8, category: "وظائف المخازن" },

  // 15- أمناء الصندوق
  { id: "j_cs_5", name: "أمين صندوق أقدم", code: "CS-SR", defaultGrade: 5, category: "أمناء الصندوق" },
  { id: "j_cs_6", name: "أمين صندوق", code: "CS", defaultGrade: 6, category: "أمناء الصندوق" },
  { id: "j_cs_7", name: "معاون أمين صندوق", code: "CS-AST", defaultGrade: 7, category: "أمناء الصندوق" },

  // 16- الرسامون الهندسيون
  { id: "j_dr_3", name: "رئيس رسامين هندسيين أقدم", code: "DR-CSR", defaultGrade: 3, category: "الرسامون الهندسيون" },
  { id: "j_dr_4", name: "رئيس رسامين هندسيين", code: "DR-CH", defaultGrade: 4, category: "الرسامون الهندسيون" },
  { id: "j_dr_5", name: "معاون رئيس رسامين هندسيين", code: "DR-DCH", defaultGrade: 5, category: "الرسامون الهندسيون" },
  { id: "j_dr_6", name: "رسام هندسي أقدم", code: "DR-SR", defaultGrade: 6, category: "الرسامون الهندسيون" },
  { id: "j_dr_7", name: "رسام هندسي", code: "DR", defaultGrade: 7, category: "الرسامون الهندسيون" },
  { id: "j_dr_8", name: "معاون رسام هندسي", code: "DR-AST", defaultGrade: 8, category: "الرسامون الهندسيون" },

  // 17- المساحون
  { id: "j_sv_3", name: "رئيس مساحين أقدم", code: "SV-CSR", defaultGrade: 3, category: "المساحون" },
  { id: "j_sv_4", name: "رئيس مساحين", code: "SV-CH", defaultGrade: 4, category: "المساحون" },
  { id: "j_sv_5", name: "معاون رئيس مساحين", code: "SV-DCH", defaultGrade: 5, category: "المساحون" },
  { id: "j_sv_6", name: "مساح أقدم", code: "SV-SR", defaultGrade: 6, category: "المساحون" },
  { id: "j_sv_7", name: "مساح", code: "SV", defaultGrade: 7, category: "المساحون" },
  { id: "j_sv_8", name: "معاون مساح", code: "SV-AST", defaultGrade: 8, category: "المساحون" },

  // 18- كتاب الطابعة
  { id: "j_ty_5",  name: "رئيس كتاب طابعة", code: "TY-CH", defaultGrade: 5, category: "كتاب الطابعة" },
  { id: "j_ty_6",  name: "معاون رئيس كتاب طابعة", code: "TY-DCH", defaultGrade: 6, category: "كتاب الطابعة" },
  { id: "j_ty_7",  name: "كاتب طابعة أقدم", code: "TY-SR", defaultGrade: 7, category: "كتاب الطابعة" },
  { id: "j_ty_8",  name: "كاتب طابعة أول", code: "TY-1", defaultGrade: 8, category: "كتاب الطابعة" },
  { id: "j_ty_9",  name: "كاتب طابعة ثاني", code: "TY-2", defaultGrade: 9, category: "كتاب الطابعة" },
  { id: "j_ty_10", name: "كاتب طابعة ثالث", code: "TY-3", defaultGrade: 10, category: "كتاب الطابعة" },

  // 19- الحرفيون
  { id: "j_cr_5",  name: "رئيس حرفيين أقدم", code: "CR-CSR", defaultGrade: 5, category: "الحرفيون والخدميون" },
  { id: "j_cr_6",  name: "رئيس حرفيين", code: "CR-CH", defaultGrade: 6, category: "الحرفيون والخدميون" },
  { id: "j_cr_7",  name: "معاون رئيس حرفيين", code: "CR-DCH", defaultGrade: 7, category: "الحرفيون والخدميون" },
  { id: "j_cr_8",  name: "حرفي أقدم", code: "CR-SR", defaultGrade: 8, category: "الحرفيون والخدميون" },
  { id: "j_cr_9",  name: "حرفي أول", code: "CR-1", defaultGrade: 9, category: "الحرفيون والخدميون" },
  { id: "j_cr_10", name: "حرفي", code: "CR", defaultGrade: 10, category: "الحرفيون والخدميون" },
  { id: "j_cr_11", name: "معاون حرفي", code: "CR-AST", defaultGrade: 11, category: "الحرفيون والخدميون" },
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
