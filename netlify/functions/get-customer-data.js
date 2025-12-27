// netlify/functions/get-customer-data.js
const db = require('./database');

// นี่คือ API สาธารณะ ไม่จำเป็นต้องมีการยืนยันตัวตน (login)
exports.handler = async (event, context) => {
  // อนุญาตเฉพาะการร้องขอแบบ GET เท่านั้น
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. ดึงข้อมูลหมวดหมู่ (Categories)
    const categoriesResult = await db.query('SELECT * FROM categories ORDER BY sort_order ASC');

    // 2. ดึงข้อมูลสินค้า (Products) ทั้งหมด
    const productsResult = await db.query('SELECT * FROM products ORDER BY category_id, level ASC');

    // 3. ดึงข้อมูลการตั้งค่าร้าน (Shop Settings) ทั้งหมดจากฐานข้อมูล
    const settingsResult = await db.query('SELECT settings_json FROM shop_settings WHERE id = 1');
    const allShopSettings = settingsResult.rows[0]?.settings_json || {};

    // 4. *** สำคัญมาก ***
    // สร้าง object 'shopSettings' ที่ "ปลอดภัย" เพื่อส่งให้ลูกค้า
    // เราต้องคัดกรองข้อมูลที่ละเอียดอ่อน (เช่น โค้ดส่วนลด, ข้อมูลภายใน) ออกไป
    const safeShopSettings = {
      // ข้อมูลแบรนด์และธีม
      shopName: allShopSettings.shopName,
      slogan: allShopSettings.slogan,
      shopNameColor: allShopSettings.shopNameColor,
      sloganColor: allShopSettings.sloganColor,
      themeName: allShopSettings.themeName,
      logo: allShopSettings.logo,
      useLogo: allShopSettings.useLogo,
      darkMode: allShopSettings.darkMode,

      // ฟอนต์และการปรับขนาด
      fontFamily: allShopSettings.fontFamily,
      globalFontFamily: allShopSettings.globalFontFamily,
      globalFontSize: allShopSettings.globalFontSize,
      mainMenuFontSize: allShopSettings.mainMenuFontSize,
      subMenuFontSize: allShopSettings.subMenuFontSize,
      shopNameFontSize: allShopSettings.shopNameFontSize,
      sloganFontSize: allShopSettings.sloganFontSize,
      sloganFontFamily: allShopSettings.sloganFontFamily,

      // เอฟเฟกต์
      shopNameEffect: allShopSettings.shopNameEffect,
      sloganEffect: allShopSettings.sloganEffect,
      logoEffect: allShopSettings.logoEffect,
      effects: allShopSettings.effects, // เอฟเฟกต์เทศกาล (ปลอดภัย)

      // พื้นหลังและลิขสิทธิ์
      backgroundImage: allShopSettings.backgroundImage,
      backgroundOpacity: allShopSettings.backgroundOpacity,
      backgroundBlur: allShopSettings.backgroundBlur,
      copyrightText: allShopSettings.copyrightText,
      copyrightOpacity: allShopSettings.copyrightOpacity,

      // --- ส่วนที่อัปเดตตามคำขอ ---
      // สถานะร้านค้าและข้อความ (สำหรับลูกค้า)
      shopEnabled: allShopSettings.shopEnabled,
      announcementEnabled: allShopSettings.announcementEnabled,
      shopClosedMessageText: allShopSettings.shopClosedMessageText,
      announcementMessageText: allShopSettings.announcementMessageText,
      messageSettings: allShopSettings.messageSettings, // (รวมการตั้งค่าข้อความวิ่ง)

      // --- เพิ่มการตั้งค่า เปิด/ปิด การสมัครสมาชิก ---
      registrationEnabled: allShopSettings.registrationEnabled ?? true,

      // UI Layout (สำหรับลูกค้า)
      salesMode: allShopSettings.salesMode,
      orderBarSettings: allShopSettings.orderBarSettings, // (การตั้งค่าแถบสั่งซื้อ)
      gridLayoutSettings: allShopSettings.gridLayoutSettings, // (การตั้งค่ากริดสินค้า)
      priceTagConfig: allShopSettings.priceTagConfig, // (การตั้งค่าป้ายราคา 🏷️)
      // --- จบส่วนอัปเดต ---

      // UI อื่นๆ
      loadingScreen: allShopSettings.loadingScreen,
      successAnimation: allShopSettings.successAnimation,
      language: allShopSettings.language

      // *** ข้อมูลที่ถูกคัดกรองออก (ไม่ส่งให้ลูกค้า) ***
      // - promotions (มีโค้ดส่วนลดทั้งหมด)
      // - orderNumberCounters (ตรรกะภายใน)
      // - managerName, shareholderName (ข้อมูลส่วนตัว)
      // - และข้อมูลอื่นๆ เฉพาะสำหรับแอดมิน
    };

    // 5. รวบรวมข้อมูลทั้งหมดเพื่อส่งกลับไป
    const customerData = {
      categories: categoriesResult.rows,
      products: productsResult.rows,
      shopSettings: safeShopSettings // ส่งเฉพาะข้อมูลที่ปลอดภัย
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // ตั้งค่า Cache 60 วินาที เพื่อให้ลูกค้าได้ข้อมูลใหม่ๆ แต่ไม่โหลดบ่อยเกินไป
        'Cache-Control': 'public, max-age=60'
      },
      body: JSON.stringify(customerData),
    };

  } catch (error) {
    console.error('Error in get-customer-data function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch customer data.' }),
    };
  }
};
