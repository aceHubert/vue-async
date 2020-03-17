export const isProduction = process.env.NODE_ENV === 'production';

export function warn(condition: boolean, message: string) {
  if (condition) {
    console.warn(message);
  }
}

export function error(condition: boolean, message: string) {
  if (condition) {
    console.error(message);
  }
}
