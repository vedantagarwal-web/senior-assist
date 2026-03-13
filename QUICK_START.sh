#!/bin/bash

# SeniorAssist MVP - Quick Start Script
# Run this to set up and start the project

set -e  # Exit on error

echo "🚀 SeniorAssist MVP - Quick Start"
echo "================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

if [ ! -d "backend/node_modules" ]; then
    echo "  Installing backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "  Installing frontend..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "automation/node_modules" ]; then
    echo "  Installing automation..."
    cd automation && npm install && cd ..
    echo "  Installing Playwright browsers..."
    cd automation && npx playwright install chromium && cd ..
fi

echo ""
echo "✅ Dependencies installed"
echo ""

# Check .env
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env with your API keys:"
    echo "   - TWILIO_ACCOUNT_SID"
    echo "   - TWILIO_AUTH_TOKEN"
    echo "   - TWILIO_PHONE_NUMBER"
    echo "   - OPENAI_API_KEY (optional for Whisper)"
    echo "   - ELEVENLABS_API_KEY (optional for better TTS)"
    echo ""
    read -p "Press Enter when you've configured backend/.env..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start the backend:   cd backend && npm run dev"
echo "  2. Start the frontend:  cd frontend && npm run dev"
echo "  3. (Optional) Expose with ngrok:  ngrok http 3001"
echo ""
echo "Then configure Twilio webhook and test!"
echo ""
echo "📚 See SETUP.md for detailed instructions"
echo "🧪 See TEST.md for testing guide"
echo ""
