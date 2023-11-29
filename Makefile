.PHONY: all dev
MAGENTO_DIR=/var/www/taraformula/public
STOREFRONT_DIR=/var/www/taraformula/storefront

local: dev
init: enable_lint

all:
	make build
	yarn start

build:
	yarn install
	yarn build
	rm -rf $(MAGENTO_DIR)/pwa
	mkdir $(MAGENTO_DIR)/pwa
	cp -R $(STOREFRONT_DIR)/dist/* $(MAGENTO_DIR)/pwa/

dev:
	yarn install
	yarn watch

# Command to refresh packages
refresh:
	rm -rf node_modules
	yarn install

# Pull Request creation
pr_integration:
	xdg-open "https://github.com/SalonyNetwork/magento-storefront/compare/integration...`git rev-parse --abbrev-ref HEAD`" > /dev/null 2> /dev/null

pr:
	xdg-open "https://github.com/SalonyNetwork/magento-storefront/compare/staging...`git rev-parse --abbrev-ref HEAD`" > /dev/null 2> /dev/null

# Enable lint
enable_lint:
	yarn run githooks
