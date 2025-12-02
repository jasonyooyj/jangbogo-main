export const PRODUCTS = [
  { id: 1, name: '유기농 우유', price: 4500, category: 'Dairy', location: { x: 20, y: 20 }, section: 'C3', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: '신선한 사과 (1봉)', price: 8900, category: 'Produce', location: { x: 80, y: 20 }, section: 'A1', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=100&q=80' },
  { id: 3, name: '통밀 식빵', price: 3200, category: 'Bakery', location: { x: 20, y: 80 }, section: 'B2', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: '제주 삼다수 2L', price: 1100, category: 'Beverage', location: { x: 80, y: 80 }, section: 'D4', image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=100&q=80' },
  { id: 5, name: '한우 등심 1++', price: 45000, category: 'Meat', location: { x: 50, y: 20 }, section: 'A2', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=100&q=80' },
  { id: 6, name: '감자칩', price: 2000, category: 'Snack', location: { x: 50, y: 80 }, section: 'D2', image: 'https://plus.unsplash.com/premium_photo-1672753747124-2bd4da9931fa?auto=format&fit=crop&w=800&q=80' },
  // Tteokbokki Ingredients
  { id: 7, name: '떡볶이 떡', price: 3500, category: 'Fresh', location: { x: 15, y: 15 }, section: 'A1', image: 'https://img-cf.kurly.com/hdims/resize/%3E720x/quality/90/src/shop/data/goodsview/20221020/gv10000438072_1.jpg' },
  { id: 8, name: '사각 어묵', price: 2000, category: 'Fresh', location: { x: 85, y: 15 }, section: 'A2', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=100&q=80' },
  { id: 9, name: '대파', price: 1500, category: 'Produce', location: { x: 80, y: 25 }, section: 'A1', image: 'https://images.unsplash.com/photo-1618888007540-2bdead974bbb?auto=format&fit=crop&w=100&q=80' },
  { id: 10, name: '고추장', price: 6500, category: 'Condiment', location: { x: 30, y: 50 }, section: 'B1', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=100&q=80' },
  // Meal Kits
  { id: 11, name: '떡볶이 밀키트', price: 9900, category: 'MealKit', location: { x: 45, y: 45 }, section: 'C2', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80' },
  { id: 12, name: '즉석 떡볶이', price: 5500, category: 'Instant', location: { x: 55, y: 85 }, section: 'D1', image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=100&q=80' },
  // Steak Ingredients
  { id: 13, name: '아스파라거스', price: 4500, category: 'Produce', location: { x: 75, y: 25 }, section: 'A1', image: 'https://images.unsplash.com/photo-1515041219749-b934d9d877ca?auto=format&fit=crop&w=100&q=80' },
  { id: 14, name: '통마늘', price: 3000, category: 'Produce', location: { x: 70, y: 30 }, section: 'A1', image: 'https://images.unsplash.com/photo-1615477095478-f79bd8fbf256?auto=format&fit=crop&w=100&q=80' },
  { id: 15, name: '버터', price: 6000, category: 'Dairy', location: { x: 25, y: 45 }, section: 'C1', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=100&q=80' },
];

export const PAST_PURCHASES = [
  { id: 101, date: '2023.11.20', product: PRODUCTS[0] }, // Milk
  { id: 102, date: '2023.11.20', product: PRODUCTS[1] }, // Apple
  { id: 103, date: '2023.11.15', product: PRODUCTS[6] }, // Tteokbokki Rice Cake
  { id: 104, date: '2023.11.10', product: PRODUCTS[5] }, // Chips
];

export const RECOMMENDATIONS = [
  { id: 2, name: '신선한 사과', discount: '10%', desc: '제철 과일 특가' },
  { id: 5, name: '한우 등심', discount: '5%', desc: '오늘 들어온 고기' },
  { id: 6, name: '감자칩', discount: '2+1', desc: '맥주 안주 추천' },
];

export const RECIPES = [
  {
    id: 1,
    title: '한우 스테이크와 구운 야채',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kLd1wYf9wU8', // 스테이크 레시피
    embedUrl: 'https://www.youtube.com/embed/kLd1wYf9wU8', // Detail Page용
    description: '집에서도 레스토랑처럼 즐기는 완벽한 스테이크 굽는 법을 알려드립니다. 신선한 야채와 함께 곁들여 보세요.',
    ingredients: [
      { name: '한우 등심', amount: '300g' },
      { name: '아스파라거스', amount: '3개' },
      { name: '마늘', amount: '5쪽' },
      { name: '버터', amount: '20g' },
      { name: '올리브유', amount: '2큰술' },
      { name: '소금', amount: '약간' },
      { name: '후추', amount: '약간' }
    ],
    relatedProductIds: [5, 13, 14, 15] // Hanwoo, Asparagus, Garlic, Butter
  },
  {
    id: 2,
    title: '신선한 사과 샐러드',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=uVwtVBpw7RQ', // 샐러드 레시피
    embedUrl: 'https://www.youtube.com/embed/uVwtVBpw7RQ', // Detail Page용
    description: '아삭한 사과와 신선한 채소가 어우러진 건강한 샐러드입니다. 가벼운 아침 식사나 다이어트 메뉴로 추천해요.',
    ingredients: [
      { name: '사과', amount: '1개' },
      { name: '양상추', amount: '100g' },
      { name: '요거트 드레싱', amount: '3큰술' },
      { name: '견과류', amount: '한 줌' }
    ],
    relatedProductIds: [2, 1] // 사과, 우유
  }
];