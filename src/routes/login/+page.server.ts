import type { Actions } from './$types';
import { PASSWORD } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { createJwt } from '$lib/server/helpers/jwt';

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const inputPassword = formData.get('password');
    const encodedPassword = Buffer.from(PASSWORD).toString('base64');
    if (inputPassword !== encodedPassword) {
      return fail(401, { invalid: true });
    }

    const token = await createJwt();
    cookies.set('auth', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 3600
    });

    throw redirect(303, '/');
  }
} satisfies Actions;
