export function ctrlWrapper(controller) {
  return async function (req, res, next) {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
