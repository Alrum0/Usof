export function timeAgo(publishDate) {
  const now = new Date();
  const published = new Date(publishDate);
  const diffMs = now - published;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const pluralize = (n, forms) => {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  };

  if (diffSec < 60) return 'щойно';
  if (diffMin < 60)
    return `${diffMin} ${pluralize(diffMin, [
      'хвилину',
      'хвилини',
      'хвилин',
    ])} тому`;
  if (diffHour < 24)
    return `${diffHour} ${pluralize(diffHour, [
      'годину',
      'години',
      'годин',
    ])} тому`;
  if (diffDay < 30)
    return `${diffDay} ${pluralize(diffDay, ['день', 'дні', 'днів'])} тому`;
  if (diffMonth < 12)
    return `${diffMonth} ${pluralize(diffMonth, [
      'місяць',
      'місяці',
      'місяців',
    ])} тому`;
  return `${diffYear} ${pluralize(diffYear, ['рік', 'роки', 'років'])} тому`;
}
