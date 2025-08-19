# Root Makefile
CLIENT_DIR=client
SERVER_DIR=server
WWWROOT_DIR=$(SERVER_DIR)/dist/wwwroot

.PHONY: build start clean

build:
	@echo "=== Step 1: Delete server/dist folder ==="
	rm -rf $(SERVER_DIR)/dist

	@echo "=== Step 2: Delete client/dist folder ==="
	rm -rf $(CLIENT_DIR)/dist

	@echo "=== Step 3: Build client ==="
	cd $(CLIENT_DIR) && npm install && npm run build

	@echo "=== Step 4: Copy frontend into server/dist/wwwroot ==="
	mkdir -p $(WWWROOT_DIR)
	cp -r $(CLIENT_DIR)/dist/* $(WWWROOT_DIR)/

	@echo "=== Step 5: Build server ==="
	cd $(SERVER_DIR) && npm install && npm run build

	@echo "=== Full build done ==="

# Start production server
start:
	@echo "=== Starting server ==="
	cd $(SERVER_DIR) && NODE_ENV=production node dist/index.js

# Clean client & server builds
clean:
	@echo "=== Cleaning client and server dist folders ==="
	rm -rf $(CLIENT_DIR)/dist
	rm -rf $(SERVER_DIR)/dist
