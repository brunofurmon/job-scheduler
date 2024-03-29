.DEFAULT_GOAL := start
.PHONY: help

DOCKER_STAGE ?= development
# Checks if STDIN is terminal (interactive)
INTERACTIVE := $(shell [ -t 0 ] && echo i || echo d)
# Returns date in YYYY-MM format
DOCKER_DATE_TAG=$(shell date +%Y-%m)
APPDIR = /usr/app
SERVER_PORT=3000
PORT_DEBUG=5858
CONTAINER_NAME=job-scheduler

setup: build-docker-image ## Install dependencies
ifeq ("$(wildcard ./env)","")
	@cp .env.example .env
endif

check-if-image-is-built:
ifeq ($(shell docker images -q brunofurmon/${CONTAINER_NAME}:date-${DOCKER_DATE_TAG} 2> /dev/null | wc -l | bc),0)
	@echo "Docker image not found for this month/year, building..."
	@make build-docker-image
endif

build-docker-image:
	@echo 'Building docker image'
	@docker build --no-cache . --target ${DOCKER_STAGE} -t brunofurmon/${CONTAINER_NAME}:latest -t brunofurmon/${CONTAINER_NAME}:date-${DOCKER_DATE_TAG}

start: check-if-image-is-built
	@echo 'Running on http://localhost:$(SERVER_PORT)'
	@docker run -t${INTERACTIVE} --rm -v ${PWD}:${APPDIR}:delegated --env-file=.env -p $(SERVER_PORT):$(SERVER_PORT) -p $(PORT_DEBUG):5858 -e USER_PERM=$(shell id -u):$(shell id -g) --name ${CONTAINER_NAME} -e BIN_PATH="src/index.js" brunofurmon/${CONTAINER_NAME}:latest

start-server: check-if-image-is-built
	@echo 'Running server'
	@docker run -t${INTERACTIVE} --rm -v ${PWD}:${APPDIR}:delegated --env-file=.env -p $(SERVER_PORT):$(SERVER_PORT) -p $(PORT_DEBUG):5858 -e USER_PERM=$(shell id -u):$(shell id -g) --name ${CONTAINER_NAME}-server -e BIN_PATH="./src/application/server"  brunofurmon/${CONTAINER_NAME}:latest

start-worker: check-if-image-is-built
	@echo 'Running worker'
	@docker run -t${INTERACTIVE} --rm -v ${PWD}:${APPDIR}:delegated --env-file=.env -p $(SERVER_PORT):$(SERVER_PORT) -p $(PORT_DEBUG):5858 -e USER_PERM=$(shell id -u):$(shell id -g) --name ${CONTAINER_NAME}-server -e BIN_PATH="./src/application/worker"  brunofurmon/${CONTAINER_NAME}:latest

stop: ## Stops project
	@docker stop ${CONTAINER_NAME}