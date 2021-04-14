FROM node:12.22.1-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@7.5.2 -g

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/node_app && chown node:node /opt/node_app
# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node
WORKDIR /opt/node_app
COPY --chown=node:node package*.json package-lock.json* ./
RUN npm config list \
    && npm ci \
    && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

FROM base as source
# copy in our source code last, as it changes the most
COPY --chown=node:node . ./app

FROM source as prod
# check every 30s to ensure this service returns HTTP 200
COPY --chown=node:node ./dist ./app/dist

# if you want to use npm start instead, then use `docker run --init in production`
# so that signals are passed properly. Note the code in index.js is needed to catch Docker signals
# using node here is still more graceful stopping then npm with --init afaik
# I still can't come up with a good production way to run with npm and graceful shutdown
CMD [ "node", "./app/dist/src/main" ]

## Stage 2 (development)
# we don't COPY in this stage because for dev you'll bind-mount anyway
# this saves time when building locally for dev via docker-compose
FROM source as dev
ENV NODE_ENV=development
ENV PATH /opt/node_app/node_modules/.bin:$PATH
RUN npm install --only=development \
    && npm cache clean --force
WORKDIR /opt/node_app/app
CMD ["npm", "run", "start:debug"]
