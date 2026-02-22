const { Client } = require('pg');

// بارگذاری تنظیمات از فایل .env اگر موجود باشد
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('⚠️  dotenv موجود نیست، از متغیرهای محیطی سیستم استفاده می‌شود');
}

async function setupAnalyticsTables() {
  // تنظیمات اتصال به دیتابیس
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!databaseUrl) {
    console.error('❌ متغیر DATABASE_URL یا POSTGRES_URL تنظیم نشده است');
    console.log('💡 برای تنظیم متغیر محیطی:');
    console.log('export DATABASE_URL="postgresql://username:password@host:port/database"');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  let success = false;
  const createdTables = [];
  const errors = [];

  try {
    console.log('🔧 اتصال به دیتابیس...');
    await client.connect();
    console.log('✅ اتصال برقرار شد');

    console.log('🚀 شروع ایجاد جداول آنالیتیک...\n');

    // 1. ایجاد جدول site_analytics
    console.log('📊 ایجاد جدول site_analytics...');
    try {
      await client.query(`
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
      `);
      
      // ایندکس‌های site_analytics
      const siteAnalyticsIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_analytics_date ON site_analytics(visit_date)',
        'CREATE INDEX IF NOT EXISTS idx_analytics_page ON site_analytics(page_url)',
        'CREATE INDEX IF NOT EXISTS idx_analytics_ip ON site_analytics(visitor_ip)',
        'CREATE INDEX IF NOT EXISTS idx_analytics_created ON site_analytics(created_at)',
        'CREATE INDEX IF NOT EXISTS idx_analytics_country ON site_analytics(country)'
      ];

      for (const indexQuery of siteAnalyticsIndexes) {
        await client.query(indexQuery);
      }

      createdTables.push('site_analytics');
      console.log('✅ جدول site_analytics ایجاد شد');
    } catch (error) {
      const errorMsg = `خطا در ایجاد جدول site_analytics: ${error.message}`;
      errors.push(errorMsg);
      console.log(`❌ ${errorMsg}`);
    }

    // 2. ایجاد جدول project_views
    console.log('📈 ایجاد جدول project_views...');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS project_views (
          id SERIAL PRIMARY KEY,
          project_id VARCHAR(255) NOT NULL,
          visitor_ip VARCHAR(45) NOT NULL,
          user_agent TEXT,
          referer VARCHAR(500),
          view_date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // ایندکس‌های project_views
      const projectViewsIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_project_views_project ON project_views(project_id)',
        'CREATE INDEX IF NOT EXISTS idx_project_views_date ON project_views(view_date)',
        'CREATE INDEX IF NOT EXISTS idx_project_views_ip ON project_views(visitor_ip)',
        'CREATE INDEX IF NOT EXISTS idx_project_views_created ON project_views(created_at)'
      ];

      for (const indexQuery of projectViewsIndexes) {
        await client.query(indexQuery);
      }

      createdTables.push('project_views');
      console.log('✅ جدول project_views ایجاد شد');
    } catch (error) {
      const errorMsg = `خطا در ایجاد جدول project_views: ${error.message}`;
      errors.push(errorMsg);
      console.log(`❌ ${errorMsg}`);
    }

    // 3. ایجاد جدول landing_pages
    console.log('🎯 ایجاد جدول landing_pages...');
    try {
      await client.query(`
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
      `);

      // ایندکس‌های landing_pages
      const landingPagesIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_landing_pages_url ON landing_pages(page_url)',
        'CREATE INDEX IF NOT EXISTS idx_landing_pages_date ON landing_pages(created_at)',
        'CREATE INDEX IF NOT EXISTS idx_landing_pages_session ON landing_pages(session_id)',
        'CREATE INDEX IF NOT EXISTS idx_landing_pages_ip ON landing_pages(visitor_ip)'
      ];

      for (const indexQuery of landingPagesIndexes) {
        await client.query(indexQuery);
      }

      createdTables.push('landing_pages');
      console.log('✅ جدول landing_pages ایجاد شد');
    } catch (error) {
      const errorMsg = `خطا در ایجاد جدول landing_pages: ${error.message}`;
      errors.push(errorMsg);
      console.log(`❌ ${errorMsg}`);
    }

    // 4. ایجاد جدول analytics_events
    console.log('🎨 ایجاد جدول analytics_events...');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id SERIAL PRIMARY KEY,
          event_type VARCHAR(100) NOT NULL,
          event_data TEXT,
          page_url VARCHAR(500),
          visitor_ip VARCHAR(45) NOT NULL,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // ایندکس‌های analytics_events
      const analyticsEventsIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type)',
        'CREATE INDEX IF NOT EXISTS idx_events_date ON analytics_events(created_at)',
        'CREATE INDEX IF NOT EXISTS idx_events_ip ON analytics_events(visitor_ip)'
      ];

      for (const indexQuery of analyticsEventsIndexes) {
        await client.query(indexQuery);
      }

      createdTables.push('analytics_events');
      console.log('✅ جدول analytics_events ایجاد شد');
    } catch (error) {
      const errorMsg = `خطا در ایجاد جدول analytics_events: ${error.message}`;
      errors.push(errorMsg);
      console.log(`❌ ${errorMsg}`);
    }

    // بررسی نهایی وضعیت جداول
    console.log('\n🔍 بررسی جداول ایجاد شده...');
    const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns 
              WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('site_analytics', 'project_views', 'landing_pages', 'analytics_events')
      ORDER BY table_name;
    `);

    console.log('📋 جداول موجود:');
    for (const table of tablesResult.rows) {
      console.log(`   ✅ ${table.table_name} (${table.column_count} ستون)`);
      
      // نمایش تعداد رکوردها
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        console.log(`      📊 ${countResult.rows[0].count} رکورد`);
      } catch (countError) {
        console.log(`      ⚠️  خطا در خواندن رکوردها`);
      }
    }

    // ایجاد رکوردهای نمونه در محیط توسعه
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n🧪 ایجاد رکوردهای نمونه...');
      try {
        // رکوردهای نمونه برای site_analytics
        await client.query(`
          INSERT INTO site_analytics (visitor_ip, page_url, page_title, country, city, visit_date)
          VALUES 
            ('127.0.0.1', '/', 'صفحه اصلی', 'Iran', 'Tehran', CURRENT_DATE - INTERVAL '2 days'),
            ('127.0.0.1', '/projects', 'پروژه‌ها', 'Iran', 'Tehran', CURRENT_DATE - INTERVAL '1 day'),
            ('127.0.0.1', '/about', 'درباره ما', 'Iran', 'Isfahan', CURRENT_DATE),
            ('192.168.1.100', '/', 'صفحه اصلی', 'Iran', 'Shiraz', CURRENT_DATE),
            ('192.168.1.101', '/projects', 'پروژه‌ها', 'Iran', 'Mashhad', CURRENT_DATE)
          ON CONFLICT DO NOTHING
        `);

        // رکوردهای نمونه برای analytics_events
        await client.query(`
          INSERT INTO analytics_events (event_type, event_data, page_url, visitor_ip)
          VALUES 
            ('page_view', '{"duration": 45}', '/', '127.0.0.1'),
            ('button_click', '{"button": "contact"}', '/about', '127.0.0.1'),
            ('form_submit', '{"form": "contact"}', '/contact', '192.168.1.100')
          ON CONFLICT DO NOTHING
        `);

        console.log('✅ رکوردهای نمونه ایجاد شدند');
      } catch (sampleError) {
        console.log('⚠️  خطا در ایجاد رکوردهای نمونه:', sampleError.message);
      }
    }

    success = createdTables.length > 0;

    // خلاصه نتایج
    console.log('\n📋 خلاصه نتایج:');
    console.log('================');
    console.log(`✅ جداول ایجاد شده: ${createdTables.length}/4`);
    console.log(`📊 جداول: ${createdTables.join(', ') || 'هیچ'}`);
    
    if (errors.length > 0) {
      console.log(`❌ خطاها: ${errors.length}`);
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    if (success) {
      console.log('\n🎉 راه‌اندازی سیستم آنالیتیک با موفقیت انجام شد!');
      console.log('💡 اکنون می‌توانید از صفحه آمار استفاده کنید');
    } else {
      console.log('\n⚠️  راه‌اندازی با مشکل مواجه شد');
      console.log('💡 لطفاً خطاها را بررسی و مجدداً تلاش کنید');
    }

  } catch (error) {
    console.error('❌ خطای کلی در راه‌اندازی:', error.message);
    console.error('🔧 جزئیات:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 راهکارهای احتمالی:');
      console.log('1. بررسی متغیر DATABASE_URL در فایل .env');
      console.log('2. اطمینان از در دسترس بودن دیتابیس PostgreSQL');
      console.log('3. بررسی فایروال و تنظیمات شبکه');
      console.log('4. تست اتصال دستی به دیتابیس');
    }
  } finally {
    try {
      await client.end();
      console.log('\n🔚 اتصال به دیتابیس بسته شد');
    } catch (closeError) {
      console.log('⚠️  خطا در بستن اتصال:', closeError.message);
    }
  }

  // خروج با کد مناسب
  process.exit(success ? 0 : 1);
}

// اجرای اسکریپت
if (require.main === module) {
  console.log('🚀 شروع راه‌اندازی سیستم آنالیتیک...');
  console.log('📅 تاریخ:', new Date().toLocaleString('fa-IR'));
  console.log('🌍 محیط:', process.env.NODE_ENV || 'development');
  console.log('🔗 دیتابیس:', process.env.DATABASE_URL ? 'تنظیم شده' : '❌ تنظیم نشده');
  console.log('=' .repeat(50));
  
  setupAnalyticsTables().catch(console.error);
}

module.exports = { setupAnalyticsTables };
