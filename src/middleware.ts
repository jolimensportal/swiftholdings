import { defineMiddleware } from 'astro:middleware';
import { fromAstroSession, getMemberEmail } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  if (!pathname.startsWith('/members')) {
    return next();
  }

  const email =
    context.session === undefined
      ? undefined
      : await getMemberEmail(fromAstroSession(context.session));

  if (email === undefined) {
    const nextPath = encodeURIComponent(pathname + context.url.search);

    return context.redirect(`/login?next=${nextPath}`, 302);
  }

  return next();
});
