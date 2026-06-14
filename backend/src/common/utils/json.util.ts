import { LocalizedStringDto } from '../dto';

export const toJson = (value: LocalizedStringDto | undefined) =>
  value ? (value as unknown as Record<string, string>) : undefined;
