import { API_URL } from '../config/keys';
// auth routes
export const AUTH_ROUTES_REGISTER = `${API_URL}/api/auth`;
export const AUTH_ROUTES_LOGIN = `${API_URL}/api/auth/login`;
export const VALIDATE_USER = `${API_URL}/api/auth/validateUser`;
//shift routes
export const FETCH_SHIFTS = `${API_URL}/api/shifts/getShiftsForUser`;
export const UPDATE_SHIFTS = `${API_URL}/api/shifts/updateShifts`;
