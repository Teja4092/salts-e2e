#!/bin/bash

echo "🎭 Starting Playwright tests against salt application..."

# Build and start salt application
echo "🏗️ Building Salt application..."
git clone https://github.com/Teja4092/salt.git /tmp/salt
cd /tmp/salt
docker build -f ../salt-tests/docker/Dockerfile.app -t salt-app:latest .

echo "🚀 Starting Salt application..."
docker run -d --name salt-app -p 3000:80 salt-app:latest

# Wait for application to be ready
echo "⏳ Waiting for Salt application..."
timeout 60s bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'

if [ $? -eq 0 ]; then
    echo "✅ Application is ready!"
    
    # Run tests
    echo "🧪 Running Playwright tests..."
    cd - # Return to salt-tests directory
    docker build -f docker/Dockerfile.tests -t salt-tests:latest .
    docker run --rm \
        --network host \
        -e SALT_APP_URL=http://localhost:3000 \
        -v $(pwd)/test-results:/app/test-results \
        -v $(pwd)/playwright-report:/app/playwright-report \
        salt-tests:latest
    
    TEST_EXIT_CODE=$?
    
    # Cleanup
    echo "🧹 Cleaning up..."
    docker stop salt-app
    docker rm salt-app
    rm -rf /tmp/salt
    
    exit $TEST_EXIT_CODE
else
    echo "❌ Application failed to start!"
    exit 1
fi
