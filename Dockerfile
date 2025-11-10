# 1. Empezamos desde una imagen oficial de Node.js 18 (limpia)
FROM node:18

# 2. Ponemos el directorio de trabajo
WORKDIR /opt/app

# 3. Exponemos el puerto
EXPOSE 1337

# 4. El comando por defecto será arrancar el servidor
# (create-strapi-app creará un package.json con este script)
CMD ["npm", "run", "develop"]