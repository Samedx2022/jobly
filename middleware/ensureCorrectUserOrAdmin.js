const { UnauthorizedError } = require("../expressError");

/**
 * Middleware to ensure the request is from the correct user or an admin.
 *
 * If not, throws a 401 Unauthorized error.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {UnauthorizedError} - If user is not correct or not an admin
 */
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    // Assuming req.user is set from previous auth middleware
    if (!(req.user && (req.user.isAdmin || req.user.username === req.params.username))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = ensureCorrectUserOrAdmin;
