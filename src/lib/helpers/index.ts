export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('default', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
export const formatCurrency = (amount?: number) =>
	new Intl.NumberFormat('default', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	})
		.format(amount || 0)
		.replace(/^(\D+)/, '$1 ');
