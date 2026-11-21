// --------------- (whole file added in Sprint 4)
const message = 'You must be logged in to do that.';

// Route-level gate: is anyone logged in at all? It knows nothing about
// listings or owners; the ownership check lives in the service.
export const requireLogin = (req, res, next) => {
  if (!req.user) {
    // An htmx request means the page is open but the session is gone (logged
    // out in another tab, or it expired): HX-Redirect sends the browser to
    // the login page instead of failing quietly.
    if (req.get('HX-Request') === 'true') {
      res.set('HX-Redirect', '/login');
      res.status(401).send(message);
      return;
    }
    // A plain form post (the classic form) is a browser too: send it to log in.
    if (req.is('application/x-www-form-urlencoded')) {
      res.redirect(303, '/login');
      return;
    }
    res.status(401).json({ error: message });
    return;
  }
  next();
};
// ---------------
