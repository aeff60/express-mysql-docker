# ใช้ Node.js LTS เวอร์ชันที่เสถียร
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy ไฟล์ package.json และ lock file ก่อน เพื่อลด build time
COPY package.json package-lock.json ./

# ติดตั้ง dependencies เท่านั้น (ไม่รวม devDependencies)
RUN npm ci --only=production

# คัดลอกไฟล์ที่เหลือ
COPY . .

# ตั้งค่าให้ใช้ user ที่ไม่ใช่ root เพื่อความปลอดภัย
USER node

# Start server
CMD ["node", "server.js"]
