/**
 * Validation utilities for Player, Registration, Payment, and Match forms.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePlayerForm(data: {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  teamId?: string;
  jerseyNumber?: number | string;
  phone?: string;
  position?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name / Father name is required';
  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!data.teamId) errors.teamId = 'Team selection is required';
  if (!data.position) errors.position = 'Playing position is required';
  
  if (data.jerseyNumber !== undefined && data.jerseyNumber !== '') {
    const num = Number(data.jerseyNumber);
    if (isNaN(num) || num < 1 || num > 99) {
      errors.jerseyNumber = 'Jersey number must be between 1 and 99';
    }
  }

  if (data.phone && !/^\+?[0-9]{9,15}$/.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Please enter a valid phone number (e.g. +251911223344)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validatePaymentForm(data: {
  playerId?: string;
  amount?: number | string;
  transactionId?: string;
  paymentMethod?: string;
  type?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.playerId) errors.playerId = 'Please select a player';
  if (!data.amount || Number(data.amount) <= 0) errors.amount = 'Amount must be greater than 0 ETB';
  if (!data.transactionId?.trim()) errors.transactionId = 'Transaction reference / ID is required';
  if (!data.paymentMethod) errors.paymentMethod = 'Payment method is required';
  if (!data.type) errors.type = 'Payment type is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateMatchForm(data: {
  teamId?: string;
  opponent?: string;
  date?: string;
  time?: string;
  location?: string;
  competition?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.teamId) errors.teamId = 'Club team selection is required';
  if (!data.opponent?.trim()) errors.opponent = 'Opponent team name is required';
  if (!data.date) errors.date = 'Match date is required';
  if (!data.time) errors.time = 'Kick-off time is required';
  if (!data.location?.trim()) errors.location = 'Match venue/location is required';
  if (!data.competition?.trim()) errors.competition = 'Competition/Tournament is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
