import { Router } from 'express';
import { productController } from '../container.js';
import { authMiddleware } from '../shared/middlewares/authMiddleware.js';

const productRoutes = Router();

productRoutes.post('/', authMiddleware, (req, res) => {
  return productController.create(req, res);
});

productRoutes.delete('/:id', authMiddleware, (req, res) => {
  return productController.delete(req, res);
});

productRoutes.get('/', authMiddleware, (req, res) => {
  return productController.findPaginatedFiltered(req, res);
});

productRoutes.get('/:id', authMiddleware, (req, res) => {
  return productController.findById(req, res);
});

productRoutes.put('/:id', authMiddleware, (req, res) => {
  return productController.update(req, res);
});

export { productRoutes };
