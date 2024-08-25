import { salaryService } from '$lib/services/salary.service';
import { type Actions } from '@sveltejs/kit';
import { parseFormData } from 'parse-nested-form-data';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = parseFormData(formData);
    const date = data.date as string;
    const amount = Number(data.amount) as number;
    salaryService.save({ date, amount });
    return { success: true };
  }
} satisfies Actions;
