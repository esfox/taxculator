export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('default', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
export const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat('default', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(amount || 0)
    .replace(/^(\D+)/, '$1 ');

export const debounce = (callback: (...args: unknown[]) => unknown, wait = 500) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

export const makeQueryParams = (
  params: Record<string, string | number | undefined>,
  initial?: Record<string, string> | URLSearchParams,
) => {
  const queryParams = new URLSearchParams(initial);
  for (const key in params) {
    const value = params[key];
    if (value !== undefined) {
      queryParams.set(key, value.toString());
    } else {
      queryParams.delete(key);
    }
  }

  return queryParams;
};
