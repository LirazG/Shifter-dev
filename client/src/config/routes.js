import { API_URL } from '../config/keys';
// auth routes
export const AUTH_ROUTES_REGISTER = `${API_URL}/api/auth`;
export const AUTH_ROUTES_LOGIN = `${API_URL}/api/auth/login`;
export const VALIDATE_USER = `${API_URL}/api/auth/validateUser`;
//shift routes
export const FETCH_SHIFTS = `${API_URL}/api/shifts/getShiftsForUser`;
export const UPDATE_SHIFTS = `${API_URL}/api/shifts/updateShifts`;
//employees routes
export const ADD_EMPLOYEE = `${API_URL}/api/employees`;
export const GET_EMPLOYEES = `${API_URL}/api/employees/getEmployees`;
export const EMPLOYES_AUTO_COMPLETE = `${API_URL}/api/employees/autoComplete`;
export const GET_EMPLOYEES_BY_NAME = `${API_URL}/api/employees/getByName`;

//deployment
export const DEPLOY = `${API_URL}/api/deployment`;
export const FETCH_DEPLOYMENTS = `${API_URL}/api/deployment/getDeployments`;
export const RE_DEPLOY = `${API_URL}/api/deployment/redeploy`;



