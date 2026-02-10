#!/bin/bash

# Get local IP address automatically
LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

echo "=========================================="
echo "   Stranger Chat - Local Network Server  "
echo "=========================================="
echo ""
echo "Your Local IP: http://$LOCAL_IP:3000"
echo ""
echo "Share this URL with users on your network:"
echo "  http://$LOCAL_IP:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Start the server
node server.js

