export const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (err) {
    const issues = err?.issues?.map(i => ({ path: i.path, message: i.message })) ?? [];
    res.status(400).json({ ok: false, error: 'ValidationError', issues });
  }
};
