import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 관리자 계정 생성
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: adminPassword,
      name: '관리자',
      employeeNumber: 'EMP001',
      department: '경영지원팀',
      position: '관리자',
      phoneNumber: '010-1234-5678',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Created admin:', admin.email);

  // 테스트 직원 계정들 생성
  const employeePassword = await bcrypt.hash('employee123', 10);
  
  const employees = [
    {
      email: 'kim@company.com',
      name: '김철수',
      employeeNumber: 'EMP002',
      department: '개발팀',
      position: '시니어 개발자',
      phoneNumber: '010-2345-6789',
    },
    {
      email: 'lee@company.com',
      name: '이영희',
      employeeNumber: 'EMP003',
      department: '디자인팀',
      position: '디자이너',
      phoneNumber: '010-3456-7890',
    },
    {
      email: 'park@company.com',
      name: '박민수',
      employeeNumber: 'EMP004',
      department: '영업팀',
      position: '영업 매니저',
      phoneNumber: '010-4567-8901',
    },
  ];

  for (const emp of employees) {
    const employee = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        ...emp,
        password: employeePassword,
        role: 'EMPLOYEE',
        isActive: true,
      },
    });
    console.log('✅ Created employee:', employee.email);
  }

  // 시스템 설정 생성
  const configs = [
    {
      key: 'COMPANY_LATITUDE',
      value: '37.5666805',
      description: '회사 위도 (서울시청 예시)',
    },
    {
      key: 'COMPANY_LONGITUDE',
      value: '126.9784147',
      description: '회사 경도 (서울시청 예시)',
    },
    {
      key: 'ALLOWED_RADIUS',
      value: '150',
      description: '허용 반경 (미터)',
    },
    {
      key: 'REQUIRED_ACCURACY',
      value: '50',
      description: '필요한 GPS 정확도 (미터)',
    },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
    console.log('✅ Created config:', config.key);
  }

  console.log('🎉 Seeding completed!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@company.com / admin123');
  console.log('Employee: kim@company.com / employee123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

