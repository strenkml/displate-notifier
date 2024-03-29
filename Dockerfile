# Build typescript into javascript
FROM node:16 AS BUILDER

WORKDIR /usr/src/build

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx tsc

FROM node:16

# Set the timezone
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY --from=BUILDER /usr/src/build/dist src/

CMD ["npm", "run", "runprod"]
