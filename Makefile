test:
	npm run build
	npm test

release:
	make test
	npm publish
