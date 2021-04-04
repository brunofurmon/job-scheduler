FROM node:14-slim as base
    ENV APPDIR /usr/app
    EXPOSE ${SERVER_PORT}

    WORKDIR $APPDIR

    RUN apt-get update && \
        rm -rf /var/cache/apt/* /tmp/* /var/tmp/*

FROM base as development
    ENV NODE_ENV development

    ENTRYPOINT ["./Dockerfile_entrypoint.sh"]

FROM base as production
    ENV NODE_ENV production

    ENV TINI_VERSION v0.19.0
    ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
    RUN chmod +x /tini
    ENTRYPOINT ["/tini", "--"]

    RUN addgroup --gid 1001 --system app && \
        adduser --uid 1001 --system --gid 1001 app

    COPY . $APPDIR

    RUN yarn install

    USER app

    CMD ["node", "index.js"]