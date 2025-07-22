import User from './user.js';
import Product from './product.js';

User.hasMany(Product, { foreignKey: 'created_by', as: 'products' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export { User, Product };
