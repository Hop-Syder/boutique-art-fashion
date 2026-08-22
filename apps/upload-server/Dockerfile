# Upload Server — Node.js Alpine
FROM node:20-alpine

# Dépendances système pour sharp (traitement image)
RUN apk add --no-cache vips-dev fftw-dev build-base python3

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY server.js ./

# Dossiers persistés via volumes Docker
RUN mkdir -p /app/uploads

EXPOSE 3002

CMD ["node", "server.js"]
