# 🚀 Hướng Dẫn Deploy TravelBook

Hướng dẫn chi tiết để deploy ứng dụng TravelBook lên production.

## 📋 Yêu Cầu

- Node.js 18+ 
- PostgreSQL database
- Tài khoản trên platform deploy (Vercel, Railway, hoặc VPS)

---

## 🎯 Option 1: Deploy lên Vercel (Khuyến nghị - Dễ nhất)

### Bước 1: Chuẩn bị Database

1. **Tạo PostgreSQL database:**
   - Sử dụng [Supabase](https://supabase.com) (Free tier)
   - Hoặc [Neon](https://neon.tech) (Free tier)
   - Hoặc [Railway](https://railway.app) PostgreSQL

2. **Lấy connection string:**
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

### Bước 2: Setup Vercel

1. **Cài đặt Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login vào Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

   Hoặc deploy qua GitHub:
   - Push code lên GitHub
   - Vào [vercel.com](https://vercel.com)
   - Import project từ GitHub
   - Vercel sẽ tự động detect Next.js

### Bước 3: Cấu hình Environment Variables

Trong Vercel Dashboard → Settings → Environment Variables, thêm:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### Bước 4: Chạy Migration và Seed

1. **Cài đặt Vercel CLI và Prisma:**
   ```bash
   npm install -g vercel
   ```

2. **Chạy migration:**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

3. **Seed database (optional):**
   ```bash
   npx prisma db seed
   ```

### Bước 5: Build Settings trong Vercel

Trong Vercel Dashboard → Settings → General:

- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install` hoặc `yarn install`

---

## 🚂 Option 2: Deploy lên Railway

### Bước 1: Setup Railway

1. Đăng ký tại [railway.app](https://railway.app)
2. Tạo New Project
3. Add PostgreSQL service
4. Add GitHub repo (hoặc deploy từ local)

### Bước 2: Cấu hình Environment Variables

Trong Railway Dashboard → Variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Bước 3: Cấu hình Build

Railway sẽ tự động detect Next.js. Đảm bảo:

- **Build Command:** `prisma generate && next build`
- **Start Command:** `next start`

### Bước 4: Chạy Migration

Railway sẽ tự động chạy migrations khi deploy. Hoặc chạy thủ công:

```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

---

## 🖥️ Option 3: Deploy lên VPS (Ubuntu/Debian)

### Bước 1: Chuẩn bị Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Bước 2: Setup Database

```bash
# Tạo database và user
sudo -u postgres psql
```

Trong PostgreSQL shell:
```sql
CREATE DATABASE travelbook;
CREATE USER travelbook_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE travelbook TO travelbook_user;
\q
```

### Bước 3: Clone và Build Project

```bash
# Clone repository
git clone <your-repo-url> /var/www/travelbook
cd /var/www/travelbook

# Install dependencies
npm install

# Tạo file .env
nano .env
```

Thêm vào `.env`:
```env
DATABASE_URL="postgresql://travelbook_user:your_secure_password@localhost:5432/travelbook?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

### Bước 4: Build và Migration

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed

# Build project
npm run build
```

### Bước 5: Chạy với PM2

```bash
# Start với PM2
pm2 start npm --name "travelbook" -- start

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup
```

### Bước 6: Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Tạo config
sudo nano /etc/nginx/sites-available/travelbook
```

Thêm config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/travelbook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 7: Setup SSL với Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (đã tự động setup)
```

---

## 🔐 Environment Variables Cần Thiết

Tạo file `.env` hoặc cấu hình trong platform:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT Secret (tạo random string mạnh)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Node Environment
NODE_ENV=production

# Optional: Next.js Analytics
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Tạo JWT_SECRET mạnh:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📝 Checklist Trước Khi Deploy

- [ ] Database đã được tạo và accessible
- [ ] Environment variables đã được cấu hình
- [ ] `DATABASE_URL` đã được set
- [ ] `JWT_SECRET` đã được set (random, mạnh)
- [ ] Code đã được push lên Git repository
- [ ] Dependencies đã được test local
- [ ] Build command hoạt động: `npm run build`
- [ ] Migrations đã được test: `npx prisma migrate deploy`

---

## 🧪 Test Sau Khi Deploy

1. **Kiểm tra database connection:**
   - Vào trang admin
   - Đăng nhập với tài khoản admin

2. **Test các tính năng:**
   - Đăng ký/Đăng nhập
   - Xem tours
   - Đặt tour
   - Admin panel

3. **Kiểm tra logs:**
   - Vercel: Dashboard → Deployments → View Function Logs
   - Railway: Deployments → View Logs
   - VPS: `pm2 logs travelbook`

---

## 🔄 Update/Deploy Mới

### Vercel/Railway:
- Push code lên Git → Tự động deploy

### VPS:
```bash
cd /var/www/travelbook
git pull
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart travelbook
```

---

## 🐛 Troubleshooting

### Lỗi Database Connection

```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Lỗi Build

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Lỗi Prisma

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (⚠️ Xóa dữ liệu)
npx prisma migrate reset
```

---

## 📚 Tài Liệu Tham Khảo

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

## 💡 Tips

1. **Sử dụng Vercel** nếu muốn deploy nhanh và dễ nhất
2. **Sử dụng Railway** nếu cần database và hosting cùng một nơi
3. **Sử dụng VPS** nếu cần control hoàn toàn và có kinh nghiệm

4. **Backup database** thường xuyên:
   ```bash
   pg_dump -U user database > backup.sql
   ```

5. **Monitor performance:**
   - Vercel: Built-in Analytics
   - Railway: Metrics dashboard
   - VPS: `pm2 monit`

---

Chúc bạn deploy thành công! 🎉

