# Stock Analysis Dashboard - Windows PowerShell Setup
# Run this in PowerShell as Administrator (optional)

# Colors for better output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Step { param($Message) Write-Host "🔧 $Message" -ForegroundColor Magenta }

Write-Host "🚀 Stock Analysis Dashboard - Windows Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentDir = Get-Location
Write-Info "Current directory: $currentDir"

# Step 1: Check Prerequisites
Write-Step "Checking prerequisites..."

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion is installed"
} catch {
    Write-Error "Node.js is not installed. Please install from https://nodejs.org/"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Success "npm $npmVersion is installed"
} catch {
    Write-Error "npm is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Step 2: Create React App (if not already created)
Write-Step "Setting up React application..."

if (Test-Path "package.json") {
    Write-Info "package.json found. Assuming React app already exists."
} else {
    Write-Info "Creating new React application..."
    npx create-react-app . --template typescript
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create React app"
        exit 1
    }
    Write-Success "React application created"
}

# Step 3: Install Dependencies
Write-Step "Installing dependencies..."

Write-Info "Installing core dependencies..."
npm install recharts lucide-react axios date-fns lodash react-router-dom react-query @headlessui/react @heroicons/react classnames react-hot-toast framer-motion react-intersection-observer react-virtual use-debounce react-hook-form @hookform/resolvers yup

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install core dependencies"
    exit 1
}

Write-Info "Installing development dependencies..."
npm install --save-dev @types/lodash eslint prettier prettier-plugin-tailwindcss @tailwindcss/forms @tailwindcss/typography husky lint-staged cross-env tailwindcss autoprefixer postcss

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install dev dependencies"
    exit 1
}

Write-Success "All dependencies installed"

# Step 4: Initialize Tailwind CSS
Write-Step "Setting up Tailwind CSS..."
npx tailwindcss init -p

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to initialize Tailwind CSS"
    exit 1
}

Write-Success "Tailwind CSS initialized"

# Step 5: Create Directory Structure
Write-Step "Creating project directory structure..."

$directories = @(
    "src\components\Dashboard",
    "src\components\Admin", 
    "src\components\Common",
    "src\components\Charts",
    "src\services",
    "src\hooks",
    "src\utils",
    "src\contexts",
    "src\types",
    "src\constants",
    "public\icons"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Info "Created directory: $dir"
    }
}

Write-Success "Directory structure created"

# Step 6: Create Environment Files
Write-Step "Creating environment configuration..."

# Create .env.example
$envExample = @"
# Stock Analysis Dashboard - Environment Configuration
# Copy this file to .env and update with your actual Azure Function App URLs

# Microservice Endpoints - UPDATE THESE WITH YOUR ACTUAL URLS
REACT_APP_PRICE_SERVICE_URL=https://your-price-service.azurewebsites.net/api
REACT_APP_TECHNICAL_SERVICE_URL=https://your-technical-service.azurewebsites.net/api
REACT_APP_FUNDAMENTAL_SERVICE_URL=https://your-fundamental-service.azurewebsites.net/api
REACT_APP_NEWS_SERVICE_URL=https://your-news-service.azurewebsites.net/api
REACT_APP_SOCIAL_SERVICE_URL=https://your-social-service.azurewebsites.net/api
REACT_APP_ORCHESTRATOR_SERVICE_URL=https://your-orchestrator-service.azurewebsites.net/api
REACT_APP_ML_SERVICE_URL=https://your-ml-service.azurewebsites.net/api

# Configuration
REACT_APP_API_TIMEOUT=10000
REACT_APP_POLLING_INTERVAL=30000
REACT_APP_DEBUG_MODE=false
REACT_APP_USE_MOCK_DATA=false

# Feature Flags
REACT_APP_ENABLE_REALTIME=true
REACT_APP_ENABLE_ML_PREDICTIONS=true
REACT_APP_ENABLE_ADMIN_PANEL=true

# App Configuration
REACT_APP_DEFAULT_TICKER=RELIANCE.NS
REACT_APP_VERSION=1.0.0
"@

$envExample | Out-File -FilePath ".env.example" -Encoding UTF8
Write-Success "Created .env.example"

# Create .env for development
$envDev = $envExample.Replace("REACT_APP_DEBUG_MODE=false", "REACT_APP_DEBUG_MODE=true")
$envDev = $envDev.Replace("REACT_APP_USE_MOCK_DATA=false", "REACT_APP_USE_MOCK_DATA=true")
$envDev | Out-File -FilePath ".env" -Encoding UTF8
Write-Success "Created .env (development mode enabled)"

# Step 7: Update package.json scripts
Write-Step "Updating package.json scripts..."

$packageJson = Get-Content "package.json" | ConvertFrom-Json

# Add additional scripts
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "lint" -Value "eslint src --ext .js,.jsx,.ts,.tsx" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "lint:fix" -Value "eslint src --ext .js,.jsx,.ts,.tsx --fix" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "format" -Value "prettier --write src/**/*.{js,jsx,ts,tsx,json,css,md}" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "build:analyze" -Value "npm run build && npx webpack-bundle-analyzer build/static/js/*.js" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "test:coverage" -Value "npm test -- --coverage --watchAll=false" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "start:debug" -Value "cross-env REACT_APP_DEBUG_MODE=true npm start" -Force

# Add engines
$packageJson | Add-Member -MemberType NoteProperty -Name "engines" -Value @{
    "node" = ">=16.0.0"
    "npm" = ">=8.0.0"
} -Force

# Add homepage
$packageJson | Add-Member -MemberType NoteProperty -Name "homepage" -Value "." -Force

$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
Write-Success "package.json updated"

# Step 8: Create basic configuration files
Write-Step "Creating configuration files..."

# Tailwind config
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
"@

$tailwindConfig | Out-File -FilePath "tailwind.config.js" -Encoding UTF8
Write-Success "Tailwind config created"

# Update src/index.css
$indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Custom styles */
.chart-tooltip {
  @apply bg-white p-3 border border-gray-200 rounded-lg shadow-lg;
}

.status-indicator {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}
"@

$indexCss | Out-File -FilePath "src\index.css" -Encoding UTF8
Write-Success "Updated src/index.css"

# Create .gitignore
$gitignore = @"
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
.DS_Store?
._*
Thumbs.db

# Optional
.eslintcache
.prettiercache
package-lock.json
"@

$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Success "Created .gitignore"

# Create basic ErrorBoundary
$errorBoundary = @"
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
"@

$errorBoundary | Out-File -FilePath "src\components\Common\ErrorBoundary.jsx" -Encoding UTF8
Write-Success "Created ErrorBoundary component"

# Step 9: Display next steps
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""

Write-Info "Your Stock Analysis Dashboard project has been set up successfully!"
Write-Host ""

Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. 📝 Update your Azure Function URLs in .env file:" -ForegroundColor Cyan
Write-Host "   notepad .env" -ForegroundColor White
Write-Host ""

Write-Host "2. 📄 Copy the provided component files from the documentation:" -ForegroundColor Cyan
Write-Host "   - src\components\Dashboard\StockDashboard.jsx" -ForegroundColor White
Write-Host "   - src\components\Admin\AdminPanel.jsx" -ForegroundColor White
Write-Host "   - src\services\apiService.js" -ForegroundColor White
Write-Host "   - src\hooks\useApi.js" -ForegroundColor White
Write-Host "   - src\App.js" -ForegroundColor White
Write-Host "   - src\utils\formatters.js" -ForegroundColor White
Write-Host ""

Write-Host "3. 🌐 Configure CORS on your Azure Function Apps:" -ForegroundColor Cyan
Write-Host "   Add http://localhost:3000 to allowed origins" -ForegroundColor White
Write-Host ""

Write-Host "4. 🚀 Start the development server:" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor White
Write-Host ""

Write-Host "💡 USEFUL COMMANDS:" -ForegroundColor Yellow
Write-Host "   npm start          - Start development server" -ForegroundColor White
Write-Host "   npm run build      - Build for production" -ForegroundColor White
Write-Host "   npm run lint       - Check code quality" -ForegroundColor White
Write-Host "   npm run format     - Format code" -ForegroundColor White
Write-Host "   npm test           - Run tests" -ForegroundColor White
Write-Host ""

Write-Host "🔧 DEVELOPMENT TIPS:" -ForegroundColor Yellow
Write-Host "   - Mock data is enabled by default for development" -ForegroundColor White
Write-Host "   - Debug mode is enabled to see detailed API logs" -ForegroundColor White
Write-Host "   - Check browser console for any errors" -ForegroundColor White
Write-Host ""

Write-Success "Happy coding! Your microservices integration awaits! 🚀"