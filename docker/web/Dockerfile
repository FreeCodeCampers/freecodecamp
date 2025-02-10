FROM node:20-bookworm AS builder
# global installs need root permissions, so have to happen before we switch to
# the node user
RUN npm i -g pnpm@9
# node images create a non-root user that we can use
USER node
WORKDIR /home/node/build

COPY --chown=node:node *.* .
COPY --chown=node:node client/ client/
COPY --chown=node:node shared/ shared/
COPY --chown=node:node tools/ tools/
COPY --chown=node:node curriculum/ curriculum/

ARG HOME_LOCATION
ARG API_LOCATION
ARG FORUM_LOCATION
ARG NEWS_LOCATION
ARG RADIO_LOCATION
ARG CLIENT_LOCALE
ARG CURRICULUM_LOCALE
ARG ALGOLIA_APP_ID
ARG ALGOLIA_API_KEY
ARG STRIPE_PUBLIC_KEY
ARG PAYPAL_CLIENT_ID
ARG PATREON_CLIENT_ID
ARG DEPLOYMENT_ENV
ARG SHOW_UPCOMING_CHANGES
ARG GROWTHBOOK_URI
ARG FREECODECAMP_NODE_ENV

# For simplicity and because node_modules do not make it into the final image,
# we can just install all dependencies here.
RUN pnpm install --frozen-lockfile
RUN pnpm build:client

FROM node:20-alpine
RUN npm i -g serve@13 pm2@4
USER node
WORKDIR /home/node/client
COPY --from=builder /home/node/build/client/public/ public
COPY --from=builder /home/node/build/client/serve/ ./

ENTRYPOINT [ "./pm2-start.sh" ]
CMD [ "8000" ]
