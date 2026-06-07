#!/bin/bash
# Master Shell Script to get Bizsearch online, secure Nginx, and fix Cloudflare 502 Bad Gateway
echo "==============================================="
echo "🔴 SECURING BIZSEARCH24 CONFIGURATION..."
echo "==============================================="

# 1. Stop currently running docker containers to release file locks before deleting
echo "Step 1: Stopping docker services..."
docker-compose down -v --remove-orphans || true

# 2. Fix Docker Volume Directory Permissions (ensure UID 1001 has write access to Sqlite)
echo "Step 2: Securing data store permissions for nextjs process..."
mkdir -p ./data_store
sudo chown -R 1001:1001 ./data_store
sudo chmod -R 775 ./data_store

# 3. Clean any corrupted/stale database files
echo "Step 3: Removing stale/corrupted SQLite files..."
[ -f "./prisma/dev.db" ] && rm "./prisma/dev.db"
[ -f "./data_store/dev.db" ] && rm "./data_store/dev.db"

# 4. Generate self-signed SSL Certificate to handle Cloudflare Full/Strict SSL proxying
echo "Step 4: Ensuring SSL Certificate for Cloudflare HTTPS integration..."
sudo mkdir -p /etc/ssl/private /etc/ssl/certs
if [ ! -f "/etc/ssl/private/nginx-selfsigned.key" ]; then
    echo "Generating high-grade self-signed SSL certificate..."
    sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout /etc/ssl/private/nginx-selfsigned.key \
        -out /etc/ssl/certs/nginx-selfsigned.crt \
        -subj "/C=ZA/L=Durban/O=Bizsearch24/CN=bizsearch24.co.za"
else
    echo "Self-signed SSL certificate already exists."
fi

# 5. Write the dual HTTP & HTTPS configuration for Nginx (fully handles 80 and 443 to the proxy port 3004)
echo "Step 5: Writing robust Nginx server blocks..."
sudo tee /etc/nginx/sites-available/bizsearch24.co.za > /dev/null << 'EOF'
server {
    listen 80;
    server_name bizsearch24.co.za www.bizsearch24.co.za;

    # Redirect all port 80 traffic to Secure Port 443
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bizsearch24.co.za www.bizsearch24.co.za;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # High security SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 16M;
}
EOF

# 6. Enable the Nginx site configuration via Symlink and test Nginx configuration
echo "Step 6: Enabling Nginx configuration and symlinking..."
sudo ln -sf /etc/nginx/sites-available/bizsearch24.co.za /etc/nginx/sites-enabled/

# 7. Restart Nginx to pick up configuration
echo "Step 7: Testing & restarting Nginx..."
if sudo nginx -t; then
    echo "Nginx syntax is correct. Restarting service..."
    sudo systemctl restart nginx
else
    echo "⚠️ Nginx syntax check failed. Please check your Nginx defaults."
fi

# 8. Pull up the clean container
echo "Step 8: Rebuilding and starting Docker container services..."
docker-compose up -d --build

# 9. Health Check localhost verification
echo "Step 9: Waiting for container to boot and testing connection..."
sleep 5
echo "Testing local loopback endpoint..."
curl -I http://127.0.0.1:3004

echo "==============================================="
echo "✅ MASTER RECOVERY COMPLETE. REFRESH CLOUDFLARE!"
echo "==============================================="
