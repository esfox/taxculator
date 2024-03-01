import { verifyJwt } from '$lib/server/helpers/jwt';
import { redirect, type Handle } from '@sveltejs/kit';

const unprotectedRoutes = ['/login'];

export const handle = (async ({ event, resolve }) => {
  const route = event.url.pathname;
  if (unprotectedRoutes.includes(route)) {
    return resolve(event);
  }

  const token = event.cookies.get('auth');
  if (!token) {
    throw redirect(303, '/login');
  }

  try {
    await verifyJwt(token);
  } catch (error) {
    console.error(error);
    throw redirect(303, '/login');
  }

  return resolve(event);
}) satisfies Handle;
