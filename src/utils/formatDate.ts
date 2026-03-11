import dayjs from 'dayjs';

export default function formatDate(
  date_str: string | null | undefined,
  format = 'HH:mm:ss DD/MM/YYYY',
): string {
  if (!date_str) {
    return '-';
  }

  return dayjs(date_str).format(format);
}
