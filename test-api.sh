#!/bin/bash

# Test script for Private Tips API

echo "🧪 Testing Private Tips API..."
echo ""

# Test 1: Encrypt Tip
echo "1. Testing /api/encrypt-tip..."
curl -X POST http://localhost:3000/api/encrypt-tip \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 0.01,
    "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "to": "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
  }' | jq '.'

echo ""
echo ""

# Test 2: Get KOL Balance
echo "2. Testing /api/kol-balance..."
curl -X GET "http://localhost:3000/api/kol-balance?kolId=1" | jq '.'

echo ""
echo ""

# Test 3: Relay Transaction (will use mock if no private key)
echo "3. Testing /api/relay-tx..."
ENCRYPTED=$(curl -s -X POST http://localhost:3000/api/encrypt-tip \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 0.01,
    "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "to": "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
  }' | jq -r '.ciphertext')

curl -X POST http://localhost:3000/api/relay-tx \
  -H "Content-Type: application/json" \
  -d "{
    \"ciphertext\": \"$ENCRYPTED\",
    \"toAddress\": \"0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199\"
  }" | jq '.'

echo ""
echo "✅ API tests complete!"

