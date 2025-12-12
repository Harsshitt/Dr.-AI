
#!/bin/bash
BASE_URL="http://localhost:5001/api/auth"
EMAIL="test_${RANDOM}@example.com"
NAME="TestUser"
PASSWORD="Password123!"

echo "--- 1. Testing Send OTP ($EMAIL) ---"
OTP_RES=$(curl -s -X POST "$BASE_URL/send-otp" -H "Content-Type: application/json" -d "{\"email\": \"$EMAIL\"}")
echo "Response: $OTP_RES"
OTP=$(echo $OTP_RES | grep -o '"otp":"[^"]*"' | cut -d'"' -f4)

if [ -z "$OTP" ]; then
  echo "❌ Failed to get OTP"
  exit 1
fi
echo "✅ OTP Received: $OTP"

echo "--- 2. Testing Verify OTP ---"
VERIFY_RES=$(curl -s -X POST "$BASE_URL/verify-otp" -H "Content-Type: application/json" -d "{\"email\": \"$EMAIL\", \"otp\": \"$OTP\"}")
echo "Response: $VERIFY_RES"
TOKEN=$(echo $VERIFY_RES | grep -o '"verificationToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to verify OTP"
  exit 1
fi
echo "✅ Verification Token: $TOKEN"

echo "--- 3. Testing Signup ---"
SIGNUP_RES=$(curl -s -X POST "$BASE_URL/signup" -H "Content-Type: application/json" -d "{\"name\":\"$NAME\", \"email\":\"$EMAIL\", \"password\":\"$PASSWORD\", \"dob\":\"1990-01-01\", \"sex\":\"male\", \"verificationToken\":\"$TOKEN\"}")
echo "Response: $SIGNUP_RES"

if echo "$SIGNUP_RES" | grep -q '"ok":true'; then
  echo "✅ Signup Successful"
else
  echo "❌ Signup Failed"
  exit 1
fi

echo "--- 4. Testing Login ---"
LOGIN_RES=$(curl -s -X POST "$BASE_URL/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")
echo "Response: $LOGIN_RES"

if echo "$LOGIN_RES" | grep -q '"ok":true'; then
  echo "✅ Login Successful"
else
  echo "❌ Login Failed"
  exit 1
fi
