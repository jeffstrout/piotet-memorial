// Shared guard for all /api/admin/* routes: requires
//   Authorization: Bearer <ADMIN_TOKEN>
// If ADMIN_TOKEN is unset (e.g. before it's configured on DO), every admin
// request is denied — moderation/editing stays safely locked.

export function requireAdmin(req, res, next) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
