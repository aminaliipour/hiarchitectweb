// Helper functions for number formatting
export function formatNumber(num: number): string {
  if (num === 0) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  return (num / 1000000).toFixed(1) + 'M';
}

export function formatPersianNumber(num: number): string {
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = num.toString();
  
  for (let i = 0; i < englishNumbers.length; i++) {
    result = result.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i]);
  }
  
  return result;
}

export function addCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}