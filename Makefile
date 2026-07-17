.PHONY: install dev test build deploy

install:
	npm install

dev:
	npm run dev

test:
	npm run test

build:
	npm run build

deploy: build
	firebase deploy