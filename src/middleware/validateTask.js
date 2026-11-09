const ALLOWED_STATUSES = ['pending', 'in_progress', 'completed'];

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

function validateTaskPayload(req, res, next) {
  const { title, description, status } = req.body;

  const cleanTitle = sanitizeString(title);
  const cleanDescription = sanitizeString(description);

  if (!cleanTitle || cleanTitle.length < 3 || cleanTitle.length > 120) {
    return res.status(400).json({
      error: 'Validação falhou',
      details: 'O campo "title" é obrigatório e deve ter entre 3 e 120 caracteres.'
    });
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validação falhou',
      details: `O campo "status" deve ser um dos seguintes: ${ALLOWED_STATUSES.join(', ')}.`
    });
  }

  req.validatedBody = {
    title: cleanTitle,
    description: cleanDescription,
    status: status || 'pending'
  };

  next();
}

module.exports = {
  validateTaskPayload,
  ALLOWED_STATUSES
};
