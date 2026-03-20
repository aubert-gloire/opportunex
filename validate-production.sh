#!/bin/bash

# OpportuneX Production Build Validation Script
# This script validates that your application is ready for production deployment

set -e  # Exit on any error

echo "🚀 OpportuneX - Production Build Validation"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "📦 Checking Prerequisites..."
echo "----------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js is not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm is not installed"
fi

echo ""
echo "🔍 Validating Backend..."
echo "------------------------"

# Check if backend directory exists
if [ ! -d "opportunex-server" ]; then
    check_fail "Backend directory not found"
fi

cd opportunex-server

# Check for .env file
if [ ! -f ".env" ]; then
    check_warn ".env file not found (required for production)"
else
    check_pass ".env file exists"
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi
check_pass "Backend dependencies installed"

# Check for required environment variables (if.env exists)
if [ -f ".env" ]; then
    required_vars=("MONGO_URI" "JWT_SECRET" "CLOUDINARY_CLOUD_NAME" "EMAIL_HOST")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env; then
            check_pass "$var configured"
        else
            check_warn "$var not found in .env"
        fi
    done
fi

# Run audit
echo ""
echo "Running security audit..."
npm audit --production --audit-level=high || check_warn "Security vulnerabilities found"

cd ..

echo ""
echo "🎨 Validating Frontend..."
echo "-------------------------"

# Check if frontend directory exists
if [ ! -d "opportunex-client" ]; then
    check_fail "Frontend directory not found"
fi

cd opportunex-client

# Check for .env file
if [ ! -f ".env" ]; then
    check_warn ".env file not found (required for production)"
else
    check_pass ".env file exists"
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
check_pass "Frontend dependencies installed"

# Try to build
echo ""
echo "Building frontend for production..."
if npm run build; then
    check_pass "Frontend build successful"

    # Check build size
    if [ -d "dist" ]; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        check_pass "Build output size: $BUILD_SIZE"

        # Check if index.html exists
        if [ -f "dist/index.html" ]; then
            check_pass "index.html generated"
        else
            check_fail "index.html not found in build"
        fi
    fi
else
    check_fail "Frontend build failed"
fi

# Run audit
echo ""
echo "Running security audit..."
npm audit --production --audit-level=high || check_warn "Security vulnerabilities found"

cd ..

echo ""
echo "🐳 Checking Docker Configuration..."
echo "-----------------------------------"

# Check if Docker files exist
if [ -f "docker-compose.yml" ]; then
    check_pass "docker-compose.yml exists"
else
    check_warn "docker-compose.yml not found"
fi

if [ -f "opportunex-server/Dockerfile" ]; then
    check_pass "Backend Dockerfile exists"
else
    check_warn "Backend Dockerfile not found"
fi

if [ -f "opportunex-client/Dockerfile" ]; then
    check_pass "Frontend Dockerfile exists"
else
    check_warn "Frontend Dockerfile not found"
fi

# Check if Docker is installed
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    check_pass "Docker installed: $DOCKER_VERSION"

    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        check_pass "Docker Compose installed:$COMPOSE_VERSION"
    fi
else
    check_warn "Docker is not installed (optional for deployment)"
fi

echo ""
echo "📋 Checking Documentation..."
echo "----------------------------"

docs=("README.md" "DEPLOYMENT.md" "DEPLOYMENT_CHECKLIST.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        check_pass "$doc exists"
    else
        check_warn "$doc not found"
    fi
done

echo ""
echo "==========================================="
echo -e "${GREEN}✅ Validation Complete!${NC}"
echo ""
echo "Next Steps:"
echo "1. Review DEPLOYMENT_CHECKLIST.md"
echo "2. Configure all environment variables"
echo "3. Choose your deployment platform"
echo "4. Follow DEPLOYMENT.md guide"
echo ""
echo "To deploy with Docker:"
echo "  docker-compose up -d"
echo ""
echo "To deploy manually:"
echo "  See DEPLOYMENT.md for detailed instructions"
echo ""
