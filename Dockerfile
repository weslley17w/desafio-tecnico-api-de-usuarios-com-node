FROM node:22-alpine AS dependency_back
WORKDIR /dependencies
COPY ./package*.json ./
RUN npm install

FROM node:22-alpine AS build_back
WORKDIR /build
COPY ./ .
COPY --from=dependency_back /dependencies/node_modules ./node_modules
RUN npm run build

FROM node:22-alpine AS api
WORKDIR /app
COPY ./package*.json ./
COPY --from=dependency_back /dependencies/node_modules ./node_modules
COPY --from=build_back /build ./build
EXPOSE 3000
CMD ["npm", "run", "start"]