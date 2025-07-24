import User from './user.js';
import Product from './product.js';
import RefreshToken from './refreshToken.js';

User.hasMany(Product, { foreignKey: 'created_by', as: 'products' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(RefreshToken, { foreignKey: 'created_by', as: 'refresh_token' });
RefreshToken.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export { User, Product, RefreshToken };
