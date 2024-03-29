WEBAPP_NAME:=shopping-list-webapp

set-up-development-environment:
	@echo ""
	@echo Installing git hooks...
	make install-dev-tools

	@echo ""
	@echo ""
	@echo Installing NPM dependencies outside of the container, to support pre-push builds...
	@# this step is necessary because otherwise docker compose creates a node_modules
	@# folder with root permissions and outside-container build fails
	rm -rf webapp/node_modules
	cd webapp; npm ci

	@echo ""
	@echo Building webapp container image...
	make rebuild-webapp

	@echo ""
	@echo ""
	@echo To start webapp:  make run_webapp
	@echo To start api:     make run_api

install-dev-tools:
	pre-commit install  # pre-commit is (default)
	pre-commit install --hook-type pre-push

uninstall-dev-tools:
	pre-commit uninstall  # pre-commit is (default)
	pre-commit uninstall --hook-type pre-push

remove-development-environment:
	@echo ""
	@echo Uninstalling git hooks...
	make uninstall-dev-tools

	@echo ""
	@echo Uninstalling NPM dependencies outside of the container
	rm -rf webapp/node_modules

	@echo ""
	@echo Removing docker containers and images
	docker compose down
	docker image rm $(WEBAPP_NAME) || (echo "No $(WEBAPP_NAME) found, all good."; exit 0)

#===============================================================================
#
#   webapp
#
#===============================================================================

run-webapp:
	scripts/print_local_ip_via_qr.sh
	docker-compose up $(WEBAPP_NAME)

# Recreate web app docker image
rebuild-webapp:
	docker compose down
	docker image rm $(WEBAPP_NAME) || (echo "No $(WEBAPP_NAME) found, all good."; exit 0)
	docker compose build --no-cache $(WEBAPP_NAME)

test-dev-webapp:
	docker-compose run --rm $(WEBAPP_NAME) npm test

shell-webapp:
	docker-compose run --rm $(WEBAPP_NAME) bash

deploy-webapp-from-local:
	cd ./webapp \
		&& npm run deploy_from_local
	@# TODO: docker-compose run --rm $(WEBAPP_NAME) npm run deploy_from_local

build-webapp:
	scripts/build_webapp.sh
