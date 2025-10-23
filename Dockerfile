# Etapa 1: construir dependências
FROM node:20-alpine AS builder
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Etapa 2: imagem final mais leve
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

# Porta padrão (ajuste se necessário)
EXPOSE 3000

# Comando padrão
CMD ["npm", "start"]
