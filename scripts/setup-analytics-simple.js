#!/usr/bin/env node

/**
 * اسکریپت ساده راه‌اندازی جداول آنالیتیک
 * بدون وابستگی به پکیج‌های خارجی
 */

const { Pool } = require('pg');

// تابع کمکی برای نمایش پیام‌ها
function log(emoji, message, color = '') {
  const timestamp = new Date().toLocaleTimeString('fa-IR');
  console.log(`${color}${emoji} [${timestamp}] ${message}\x1b[0m`);
}

function logSuccess(message) {
  log('✅', message, '\x1b[32m'); // سبز
}

function logError(message) {
  log('❌', message, '\x1b[31m'); // قرمز
}

function logWarning(message) {
  log('⚠️ ', message, '\x1b[33m'); // زرد
}

function logInfo(message) {
  log('ℹ️ ', message, '\x1b[36m'); // آبی
}

// استخراج تنظیمات دیتابیس از URL
function parseDatabaseUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: urlObj.port || 5432,
      database: urlObj.pathname.slice(1),
      user: urlObj.username,
      password: urlObj.password,
      ssl: urlObj.searchParams.get('sslmode') === 'require' || 
            url.includes('amazonaws.com') || 
            url.includes('railway.app') ||
            url.includes('render.com')
    };
  } catch (error) {
    throw new Error(`URL دیتابیس نامعتبر است: ${error.message}`);
  }
}

async function setupAnalytics() {
  logInfo('شروع راه‌اندازی سیستم آنالیتیک...');
  
  // بررسی متغیرهای محیطی
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!dbUrl) {
    logError('متغیر DATABASE_URL یا POSTGRES_URL یافت نشد');
    console.log('\n💡 راه‌حل‌ها:');
    console.log('1. تنظیم متغیر محیطی:');
    console.log('   export DATABASE_URL="postgresql://user:pass@host:port/db"');
    console.log('2. یا ایجاد فایل .env در ریشه پروژه');
    process.exit(1);
  }

  logInfo(`اتصال به دیتابیس: ${dbUrl.replace(/\/\/.*@/, '//***:***@')}`);

  let pool;
  try {
    // ایجاد pool اتصال
    const dbConfig = parseDatabaseUrl(dbUrl);
    pool = new Pool({
      ...dbConfig,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });

    // تست اتصال
    logInfo('تست اتصال به دیتابیس...');
    const testClient = await pool.connect();
    const testResult = await testClient.query('SELECT NOW() as time, version() as version');
    testClient.release();
    
    logSuccess('اتصال به دیتابیس برقرار شد');
    logInfo(`نسخه PostgreSQL: ${testResult.rows[0].version.split(' ')[1]}`);

    // لیست جداول مورد نیاز
    const tables = [
      {
        name: 'site_analytics',
        sql: `
          CREATE TABLE IF NOT EXISTS site_analytics (
            id SERIAL PRIMARY KEY,
            visitor_ip VARCHAR(45) NOT NULL,
            page_url VARCHAR(500) NOT NULL,
            page_title VARCHAR(200),
            user_agent TEXT,
            referer VARCHAR(500),
            country VARCHAR(100),
            city VARCHAR(100),
            visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `,
        indexes: [
          'CREATE INDEX IF NOT EXISTS idx_analytics_date ON site_analytics(visit_date)',
          'CREATE INDEX IF NOT EXISTS idx_analytics_page ON site_analytics(page_url)',
          'CREATE INDEX IF NOT EXISTS idx_analytics_ip ON site_analytics(visitor_ip)'
        ]
      },
      {
        name: 'project_views',
        sql: `
          CREATE TABLE IF NOT EXISTS project_views (
            id SERIAL PRIMARY KEY,
            project_id VARCHAR(255) NOT NULL,
            visitor_ip VARCHAR(45) NOT NULL,
            user_agent TEXT,
            referer VARCHAR(500),
            view_date DATE NOT NULL DEFAULT CURRENT_DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `,
        indexes: [
          'CREATE INDEX IF NOT EXISTS idx_project_views_project ON project_views(project_id)',
          'CREATE INDEX IF NOT EXISTS idx_project_views_date ON project_views(view_date)'
        ]
      },
      {
        name: 'landing_pages',
        sql: `
          CREATE TABLE IF NOT EXISTS landing_pages (
            id SERIAL PRIMARY KEY,
            page_url VARCHAR(500) NOT NULL,
            visitor_ip VARCHAR(45) NOT NULL,
            is_first_visit BOOLEAN DEFAULT true,
            session_id VARCHAR(100),
            visit_duration INTEGER,
            bounce BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `,
        indexes: [
          'CREATE INDEX IF NOT EXISTS idx_landing_pages_url ON landing_pages(page_url)',
          'CREATE INDEX IF NOT EXISTS idx_landing_pages_session ON landing_pages(session_id)'
        ]
      },
      {
        name: 'analytics_events',
        sql: `
          CREATE TABLE IF NOT EXISTS analytics_events (
            id SERIAL PRIMARY KEY,
            event_type VARCHAR(100) NOT NULL,
            event_data TEXT,
            page_url VARCHAR(500),
            visitor_ip VARCHAR(45) NOT NULL,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `,
        indexes: [
          'CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type)',
          'CREATE INDEX IF NOT EXISTS idx_events_date ON analytics_events(created_at)'
        ]
      }
    ];

    // ایجاد جداول
    const createdTables = [];
    const errors = [];

    for (const table of tables) {
      try {
        logInfo(`ایجاد جدول ${table.name}...`);
        
        // ایجاد جدول
        await pool.query(table.sql);
        
        // ایجاد ایندکس‌ها
        for (const indexSql of table.indexes) {
          await pool.query(indexSql);
        }
        
        createdTables.push(table.name);
        logSuccess(`جدول ${table.name} آماده است`);
        
      } catch (error) {
        const errorMsg = `خطا در ایجاد ${table.name}: ${error.message}`;
        errors.push(errorMsg);
        logError(errorMsg);
      }
    }

    // بررسی نهایی
    logInfo('بررسی جداول ایجاد شده...');
    const checkResult = await pool.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_name = t.table_name AND table_schema = 'public') as columns,
        (SELECT COUNT(*) FROM pg_indexes 
         WHERE tablename = t.table_name AND schemaname = 'public') as indexes
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('site_analytics', 'project_views', 'landing_pages', 'analytics_events')
      ORDER BY table_name
    `);

    console.log('\n📊 گزارش نهایی:');
    console.log('='.repeat(50));
    
    for (const row of checkResult.rows) {
      // شمارش رکوردها
      let recordCount = 0;
      try {
        const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${row.table_name}`);
        recordCount = parseInt(countResult.rows[0].count);
      } catch (e) {
        // اگر نتوانست بشمارد
      }
      
      logSuccess(`${row.table_name}: ${row.columns} ستون، ${row.indexes} ایندکس، ${recordCount} رکورد`);
    }

    // خلاصه
    console.log('\n📋 خلاصه:');
    console.log(`✅ جداول موفق: ${createdTables.length}/${tables.length}`);
    console.log(`❌ خطاها: ${errors.length}`);
    
    if (errors.length === 0) {
      logSuccess('🎉 سیستم آنالیتیک با موفقیت راه‌اندازی شد!');
      console.log('\n💡 مرحله بعد:');
      console.log('- به صفحه /admin/analytics بروید');
      console.log('- آمار باید به درستی نمایش داده شود');
      process.exit(0);
    } else {
      logWarning('⚠️  برخی جداول با مشکل ایجاد شدند');
      errors.forEach(err => console.log(`   • ${err}`));
      process.exit(1);
    }

  } catch (error) {
    logError(`خطای کلی: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 مشکل احتمالی: دسترسی به دیتابیس');
      console.log('- بررسی کنید دیتابیس در دسترس باشد');
      console.log('- آدرس و پورت دیتابیس را تأیید کنید');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 مشکل احتمالی: دیتابیس در حال اجرا نیست');
      console.log('- سرویس PostgreSQL را شروع کنید');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 مشکل احتمالی: اطلاعات ورود نادرست');
      console.log('- نام کاربری و رمز عبور را بررسی کنید');
    }
    
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      logInfo('اتصال‌های دیتابیس بسته شدند');
    }
  }
}

// اجرای اسکریپت
if (require.main === module) {
  console.log('🚀 راه‌اندازی سیستم آنالیتیک hiarchitect.ir');
  console.log(`📅 تاریخ: ${new Date().toLocaleString('fa-IR')}`);
  console.log('='.repeat(50));
  
  setupAnalytics().catch(error => {
    logError(`خطای غیرمنتظره: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { setupAnalytics };