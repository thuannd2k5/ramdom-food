import mongoose, { Types } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://nguyenducthuan:nguyenducthuan@cluster0.vgppgun.mongodb.net/ramdom_food';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: '' },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    mealTypes: { type: [String], default: ['lunch', 'dinner'] },
    priceMin: { type: Number, required: true },
    priceMax: { type: Number, required: true },
    tags: { type: [String], default: [] },
    isPopular: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const CategoryModel = mongoose.model('Category', categorySchema);
const FoodModel = mongoose.model('Food', foodSchema);

const categoriesData = [
  {
    name: 'Cơm các loại',
    slug: 'com-cac-loai',
    icon: 'rice',
    description: 'Cơm tấm, cơm rang, cơm văn phòng thơm ngon chắc bụng',
    sortOrder: 1,
  },
  {
    name: 'Bún & Phở',
    slug: 'bun-va-pho',
    icon: 'bowl-rice',
    description: 'Phở bò, bún chả, bún bò huế đậm đà hương vị truyền thống',
    sortOrder: 2,
  },
  {
    name: 'Mì & Miến',
    slug: 'mi-va-mien',
    icon: 'utensils',
    description: 'Mì vằn thắn, miến lươn, mì cay, mì xào giòn',
    sortOrder: 3,
  },
  {
    name: 'Bánh mì & Đồ ăn nhanh',
    slug: 'banh-mi-va-do-an-nhanh',
    icon: 'sandwich',
    description: 'Bánh mì pate, hamburger, bánh cuốn nóng hổi',
    sortOrder: 4,
  },
  {
    name: 'Ăn vặt & Trà sữa',
    slug: 'an-vat-va-tra-sua',
    icon: 'coffee',
    description: 'Trà sữa, kem, bánh tráng nướng, chè bưởi giải lao chiều',
    sortOrder: 5,
  },
];

async function seedDatabase() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB Atlas thành công!');

    // Xóa dữ liệu cũ nếu muốn làm mới
    await CategoryModel.deleteMany({});
    await FoodModel.deleteMany({});
    console.log('🧹 Đã dọn dẹp các collection cũ.');

    // Chèn danh mục
    const createdCategories = await CategoryModel.insertMany(categoriesData);
    console.log(`✅ Đã tạo ${createdCategories.length} danh mục món ăn.`);

    const getCatId = (slug: string) =>
      createdCategories.find((c) => c.slug === slug)?._id;

    const foodsData = [
      // 1. Cơm
      {
        name: 'Cơm tấm sườn bì chả',
        slug: 'com-tam-suon-bi-cha',
        description: 'Cơm tấm hạt dẻo thơm ăn kèm sườn nướng mật ong, bì thơm giòn, chả trứng và mỡ hành béo ngậy.',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('com-cac-loai'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 40000,
        priceMax: 60000,
        tags: ['dry', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Cơm rang dưa bò',
        slug: 'com-rang-dua-bo',
        description: 'Cơm rang vàng óng tơi xốp xào cùng dưa chua thanh dịu và thịt bò mềm thơm ngậy.',
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('com-cac-loai'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 40000,
        priceMax: 55000,
        tags: ['dry', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Cơm gà xối mỡ giòn rụm',
        slug: 'com-ga-xoi-mo',
        description: 'Đùi gà chiên xối mỡ da giòn rụm, thịt mọng nước ăn cùng cơm chiên cà chua thơm bùi.',
        imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('com-cac-loai'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 45000,
        priceMax: 65000,
        tags: ['dry', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Cơm sườn sốt chua ngọt',
        slug: 'com-suon-sot-chua-ngot',
        description: 'Sườn xào chua ngọt đậm đà nước sốt sền sệt, ăn tốn cơm cực kỳ cho dân văn phòng.',
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('com-cac-loai'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 35000,
        priceMax: 50000,
        tags: ['dry', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Cơm niêu cá kho tộ',
        slug: 'com-nieu-ca-kho-to',
        description: 'Cơm cháy giòn tan trong niêu đất, cá kho đậm đà gia vị tiêu ớt thơm lừng.',
        imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('com-cac-loai'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 50000,
        priceMax: 75000,
        tags: ['dry', 'spicy', 'office_favorite'],
        isPopular: false,
      },

      // 2. Bún & Phở
      {
        name: 'Phở bò tái lăn Hà Nội',
        slug: 'pho-bo-tai-lan-ha-noi',
        description: 'Thịt bò xào lăn tỏi thơm lừng, nước dùng hầm xương trong ngọt thanh và bánh phở mềm mướt.',
        imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('bun-va-pho'),
        mealTypes: ['breakfast', 'lunch', 'dinner'],
        priceMin: 40000,
        priceMax: 60000,
        tags: ['soup', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Bún chả nướng than hoa',
        slug: 'bun-cha-nuong-than-hoa',
        description: 'Chả miếng và chả băm nướng than hoa thơm nức mũi chấm nước mắm chua ngọt đu đủ giòn.',
        imageUrl: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('bun-va-pho'),
        mealTypes: ['lunch'],
        priceMin: 40000,
        priceMax: 55000,
        tags: ['dry', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Bún đậu mắm tôm thập cẩm',
        slug: 'bun-dau-mam-tom-thap-cam',
        description: 'Đậu mơ rán giòn, chả cốm dẻo thơm, nem rán, thịt luộc chấm mắm tôm đánh sủi bọt quất ớt.',
        imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('bun-va-pho'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 35000,
        priceMax: 60000,
        tags: ['dry', 'spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Bún bò Huế đặc biệt',
        slug: 'bun-bo-hue-dac-biet',
        description: 'Nước dùng cay nồng hương sả ruốc, thịt nạm bò mềm, chả cua thơm ngon và tiết luộc.',
        imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('bun-va-pho'),
        mealTypes: ['breakfast', 'lunch', 'dinner'],
        priceMin: 45000,
        priceMax: 65000,
        tags: ['soup', 'spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Bún riêu cua bắp bò',
        slug: 'bun-rieu-cua-bap-bo',
        description: 'Vị chua thanh của giấm bỗng, riêu cua đồng thơm béo ăn kèm bắp bò chần và đậu phụ rán.',
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('bun-va-pho'),
        mealTypes: ['breakfast', 'lunch'],
        priceMin: 35000,
        priceMax: 55000,
        tags: ['soup', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },

      // 3. Mì & Miến
      {
        name: 'Mì vằn thắn sủi cảo',
        slug: 'mi-van-than-sui-cao',
        description: 'Sợi mì trứng dai vàng óng, sủi cảo nhân tôm thịt mọng nước, xá xíu đậm đà và trứng luộc.',
        imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('mi-va-mien'),
        mealTypes: ['breakfast', 'lunch', 'dinner'],
        priceMin: 40000,
        priceMax: 55000,
        tags: ['soup', 'non_spicy', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Mì cay Hàn Quốc 7 cấp độ',
        slug: 'mi-cay-han-quoc-7-cap-do',
        description: 'Mì kim chi hải sản cay nồng xé lưỡi, tôm mực tươi ngon và nấm kim châm thanh mát.',
        imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('mi-va-mien'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 45000,
        priceMax: 70000,
        tags: ['soup', 'spicy'],
        isPopular: true,
      },
      {
        name: 'Miến xào hải sản cua bể',
        slug: 'mien-xao-hai-san-cua-be',
        description: 'Sợi miến dong tơi mềm thấm đẫm thịt cua biển ngọt bùi xào mộc nhĩ giòn sần sật.',
        imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('mi-va-mien'),
        mealTypes: ['lunch', 'dinner'],
        priceMin: 45000,
        priceMax: 65000,
        tags: ['dry', 'non_spicy', 'office_favorite'],
        isPopular: false,
      },

      // 4. Bánh mì & Đồ ăn nhanh
      {
        name: 'Bánh mì thịt nướng pate giòn tan',
        slug: 'banh-mi-thit-nuong-pate',
        description: 'Vỏ bánh mì giòn rụm kẹp pate gan thơm lừng, thịt nướng than hoa, dưa góp và sốt mayonnaise.',
        imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('banh-mi-va-do-an-nhanh'),
        mealTypes: ['breakfast', 'lunch', 'snack'],
        priceMin: 25000,
        priceMax: 40000,
        tags: ['dry', 'non_spicy', 'cheap', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Bánh cuốn nóng thịt băm mộc nhĩ',
        slug: 'banh-cuon-nong-thit-bam',
        description: 'Bánh cuốn mỏng tang tráng tay nóng hổi, rắc hành phi giòn ruộm ăn cùng chả quế thơm phức.',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('banh-mi-va-do-an-nhanh'),
        mealTypes: ['breakfast', 'dinner'],
        priceMin: 30000,
        priceMax: 45000,
        tags: ['non_spicy', 'cheap'],
        isPopular: true,
      },
      {
        name: 'Bánh xèo miền Tây tôm nhảy',
        slug: 'banh-xeo-mien-tay-tom-nhay',
        description: 'Vỏ bánh vàng giòn rụm cuốn bánh tráng, rau rừng chấm nước mắm tỏi ớt chua ngọt chuẩn vị.',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('banh-mi-va-do-an-nhanh'),
        mealTypes: ['dinner', 'snack'],
        priceMin: 35000,
        priceMax: 60000,
        tags: ['dry', 'non_spicy'],
        isPopular: false,
      },

      // 5. Ăn vặt & Trà sữa
      {
        name: 'Trà sữa trân châu đường đen',
        slug: 'tra-sua-tran-chau-duong-den',
        description: 'Sữa tươi thanh trùng béo ngậy quyện cùng dòng sốt đường đen ấm nóng và trân châu dẻo dai.',
        imageUrl: 'https://images.unsplash.com/photo-1558857563-b37cf0c7931c?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('an-vat-va-tra-sua'),
        mealTypes: ['snack'],
        priceMin: 30000,
        priceMax: 50000,
        tags: ['snack', 'drink', 'office_favorite'],
        isPopular: true,
      },
      {
        name: 'Bánh tráng trộn khô bò trứng cút',
        slug: 'banh-trang-tron-kho-bo',
        description: 'Bánh tráng dẻo thấm đẫm sốt me cay ngọt, xoài xanh bào sợi, rau răm và bò khô thơm cay xé.',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('an-vat-va-tra-sua'),
        mealTypes: ['snack'],
        priceMin: 20000,
        priceMax: 35000,
        tags: ['dry', 'spicy', 'cheap'],
        isPopular: true,
      },
      {
        name: 'Chè bưởi An Giang giòn ngọt',
        slug: 'che-buoi-an-giang',
        description: 'Cùi bưởi giòn sần sật không chút vị đắng, đậu xanh bùi bùi chan ngập nước cốt dừa béo ngậy.',
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
        categoryId: getCatId('an-vat-va-tra-sua'),
        mealTypes: ['snack'],
        priceMin: 20000,
        priceMax: 35000,
        tags: ['snack', 'sweet', 'cheap'],
        isPopular: false,
      },
    ];

    const createdFoods = await FoodModel.insertMany(foodsData);
    console.log(`🎉 Đã nạp thành công ${createdFoods.length} món ăn vào MongoDB Atlas!`);

    await mongoose.disconnect();
    console.log('🏁 Hoàn tất seed dữ liệu thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seedDatabase();
