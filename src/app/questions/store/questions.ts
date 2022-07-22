export interface Questions {
  id: number;
  type?: string | undefined;
  question?: string | undefined;
  options?: any,
  answers: any,
  state?: any,
}

export const TYPES = ['single', 'multiple', 'open'];