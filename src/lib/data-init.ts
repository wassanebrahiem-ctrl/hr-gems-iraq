// Initialize/access stored collections with seeds

import { useStore } from "./storage";
import {
  SEED_DEPARTMENTS, SEED_JOB_TITLES, SEED_POSITIONS, SEED_LEAVE_TYPES,
  SEED_PENALTY_TYPES, SEED_COMMENDATIONS, SEED_SALARY, SEED_EMPLOYEES,
} from "./seeds";
import type {
  Department, Employee, JobTitle, Position, LeaveType, LeaveRecord,
  PenaltyType, PenaltyRecord, CommendationType, CommendationRecord, SalaryGrade,
  EmployeeProfile, EmployeeDocument,
} from "./types";

export const useEmployees = () => useStore<Employee[]>("employees_v2", SEED_EMPLOYEES);
export const useDepartments = () => useStore<Department[]>("departments_v2", SEED_DEPARTMENTS);
export const useJobTitles = () => useStore<JobTitle[]>("jobTitles_v2", SEED_JOB_TITLES);
export const usePositions = () => useStore<Position[]>("positions_v1", SEED_POSITIONS);
export const useLeaveTypes = () => useStore<LeaveType[]>("leaveTypes", SEED_LEAVE_TYPES);
export const useLeaveRecords = () => useStore<LeaveRecord[]>("leaveRecords", []);
export const usePenaltyTypes = () => useStore<PenaltyType[]>("penaltyTypes", SEED_PENALTY_TYPES);
export const usePenaltyRecords = () => useStore<PenaltyRecord[]>("penaltyRecords", []);
export const useCommendationTypes = () => useStore<CommendationType[]>("commendationTypes", SEED_COMMENDATIONS);
export const useCommendationRecords = () => useStore<CommendationRecord[]>("commendationRecords", [
  { id: "cr1", employeeId: "e1", commendationTypeId: "c4", date: new Date(Date.now() - 30*86400000).toISOString().slice(0,10), reason: "أداء متميز خلال الربع الأخير", createdAt: new Date().toISOString() },
]);
export const useSalary = () => useStore<SalaryGrade[]>("salary", SEED_SALARY);
export const useEmployeeProfiles = () => useStore<EmployeeProfile[]>("employeeProfiles", []);
export const useEmployeeDocuments = () => useStore<EmployeeDocument[]>("employeeDocuments", []);
