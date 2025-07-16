#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Oreliya API Automated Testing${NC}"
echo "=================================="
echo ""

# Check if API is already running
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  API is already running on port 3001${NC}"
    echo ""
else
    echo -e "${BLUE}📡 Starting API server...${NC}"
    echo ""
    
    # Start the API server in the background
    pnpm dev &
    API_PID=$!
    
    # Wait for the server to start
    echo -e "${YELLOW}⏳ Waiting for API server to start...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ API server is ready!${NC}"
            echo ""
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${RED}❌ API server failed to start within 30 seconds${NC}"
            kill $API_PID 2>/dev/null
            exit 1
        fi
        sleep 1
    done
fi

# Run the API tests
echo -e "${BLUE}🧪 Running API tests...${NC}"
echo ""

# Install axios if not already installed
if ! pnpm list axios > /dev/null 2>&1; then
    echo -e "${YELLOW}📦 Installing axios dependency...${NC}"
    pnpm add axios
fi

# Run the test script
pnpm test:api

# Store the exit code
TEST_EXIT_CODE=$?

echo ""
echo -e "${BLUE}🏁 Test run completed${NC}"

# If we started the server, stop it
if [ ! -z "$API_PID" ]; then
    echo -e "${YELLOW}🛑 Stopping API server...${NC}"
    kill $API_PID 2>/dev/null
    wait $API_PID 2>/dev/null
    echo -e "${GREEN}✅ API server stopped${NC}"
fi

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
else
    echo -e "${RED}❌ Some tests failed. Check the output above for details.${NC}"
fi

exit $TEST_EXIT_CODE 