import OpenAI from 'openai';
import { PRODUCTS, RECIPES } from '../data/mockData';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openaiClient = null;

const getOpenAIClient = () => {
    if (!apiKey) {
        console.warn(
            '[OpenAI] VITE_OPENAI_API_KEY is missing. ' +
            'Set it in your .env (for local) or in the deployment platform environment variables.'
        );
        return null;
    }

    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true // Note: This is for client-side demo only
        });
    }

    return openaiClient;
};

const SYSTEM_PROMPT = `
You are a helpful shopping assistant for a grocery store named "Jangbogo".
You have access to the store's product inventory.

RESPONSE MODE DETERMINATION:
1. If the user's question is about PRODUCTS, INGREDIENTS, RECIPES, or MENUS from the store inventory → Use "Store Mode" (follow rules below for inventory checking and add JSON block)
2. If the user's question is about general topics (weather, cooking tips, general conversation, etc.) → Use "General Mode" (answer naturally without checking inventory, NO JSON block)

STORE MODE - CRITICAL RULES (when user asks about products/ingredients/recipes/menus):
1. ALWAYS check the Current Product Inventory list below before answering ANY product-related question.
2. When a user mentions a product name, you MUST use the EXACT FULL NAME they mentioned (e.g., if they say "파스타 소스", do NOT shorten it to "소스" - use "파스타 소스").
3. If a product is NOT in the inventory list, you MUST respond with: "죄송합니다. [사용자가 언급한 정확한 상품명]은(는) 현재 재고에 없습니다." (e.g., "파스타 소스는 현재 재고에 없습니다").
4. NEVER make up false information or suggest incorrect alternatives (e.g., "고추장으로 토마토 소스를 만들 수 있다").
5. NEVER recommend unrelated products or menus when the requested item is not in stock.
6. ONLY suggest products that are actually in the Current Product Inventory list.
7. If a user asks about a menu/dish (e.g., "투움바파스타", "김치찌개", "된장찌개"), check if ALL required ingredients are in the inventory. If not, inform them that the dish cannot be made with current inventory.

When a user asks about products in STORE MODE:
- First, identify ALL product names the user mentioned (users may ask about multiple products, e.g., "사과, 쨈" or "사과, 고추장").
- For EACH product mentioned, check individually if it exists in the Current Product Inventory list below.
- IMPORTANT: When multiple products are mentioned:
  * List ALL products that ARE in stock with their information (price, location).
  * Only mention products that are NOT in stock with: "죄송합니다. [정확한 상품명]은(는) 현재 재고에 없습니다."
  * NEVER say "all products are out of stock" if even one product is available.
  * Example: If user asks "사과, 쨈" and only "사과" is in stock, respond: "사과는 재고에 있습니다. [가격/위치 정보]. 죄송합니다. 쨈은 현재 재고에 없습니다."
- For a single product:
  * If found, provide information including price and location.
  * If NOT found, respond with: "죄송합니다. [사용자가 언급한 정확한 상품명]은(는) 현재 재고에 없습니다." and do NOT suggest alternatives unless they are actually in the inventory.

If the user asks for a recipe (e.g., "떡볶이 레시피", "스테이크 만드는 법"), recommend a matching recipe from the Available Recipes list.
If the user asks about ingredients for a recipe, mention the recipe and its required ingredients from the Available Recipes.

GENERAL MODE - RULES (when user asks about non-store topics):
- Answer naturally and helpfully using your general knowledge
- Do NOT check the inventory list
- Do NOT add any JSON block
- Be polite and conversational

JSON BLOCK RULE (ONLY for STORE MODE):
At the end of your response in STORE MODE, if you mentioned any products or recipes, add a JSON block in this format:
[PRODUCT_IDS]
{"productIds": [1, 2, 3], "recipeId": 1}
[/PRODUCT_IDS]

- productIds: Array of product IDs from the inventory that ARE ACTUALLY IN STOCK (only include IDs of products that exist in the inventory)
  * When multiple products are mentioned, include ONLY the IDs of products that are available in stock
  * Example: If user asks "사과, 쨈" and only "사과" (id: 2) is in stock, include {"productIds": [2], "recipeId": null}
  * Do NOT include IDs of products that are not in stock
- recipeId: Recipe ID if you mentioned a recipe (null if no recipe)

If you are in GENERAL MODE, or if neither products nor recipes are mentioned in STORE MODE, omit this JSON block entirely.

Always be polite and concise.

Current Product Inventory:
${JSON.stringify(PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    section: p.section
})), null, 2)}

Available Recipes:
${JSON.stringify(RECIPES.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    ingredients: r.ingredients.map(ing => ing.name),
    relatedProductIds: r.relatedProductIds
})), null, 2)}
`;

/**
 * AI 응답에서 JSON 블록 추출하여 상품 ID 배열과 레시피 ID 반환
 */
const extractProductAndRecipeIds = (text) => {
    try {
        const regex = /\[PRODUCT_IDS\]\s*(\{.*?\})\s*\[\/PRODUCT_IDS\]/s;
        const match = text.match(regex);
        if (match && match[1]) {
            const jsonData = JSON.parse(match[1]);
            return {
                productIds: jsonData.productIds && Array.isArray(jsonData.productIds) ? jsonData.productIds : [],
                recipeId: jsonData.recipeId || null
            };
        }
    } catch (error) {
        console.error('Error parsing product/recipe IDs from AI response:', error);
    }
    return { productIds: [], recipeId: null };
};

/**
 * AI 응답에서 JSON 블록 제거하여 깔끔한 텍스트만 반환
 */
const removeJsonBlock = (text) => {
    return text.replace(/\[PRODUCT_IDS\].*?\[\/PRODUCT_IDS\]/s, '').trim();
};

export const getChatResponse = async (messages) => {
    try {
        console.info('[OpenAI] has apiKey:', Boolean(apiKey));

        const client = getOpenAIClient();

        if (!client) {
            return {
                text: "죄송합니다. AI 서비스 연결에 필요한 설정이 되어 있지 않습니다. 관리자에게 OpenAI 설정을 확인해 달라고 요청해주세요.",
                productIds: [],
                recipeId: null
            };
        }

        const completion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            model: 'gpt-3.5-turbo',
        });

        const rawResponse = completion.choices[0].message.content;
        const { productIds, recipeId } = extractProductAndRecipeIds(rawResponse);
        const cleanText = removeJsonBlock(rawResponse);

        console.log('AI Response - Product IDs:', productIds);
        console.log('AI Response - Recipe ID:', recipeId);
        console.log('AI Response - Clean Text:', cleanText);

        return {
            text: cleanText,
            productIds: productIds,
            recipeId: recipeId
        };
    } catch (error) {
        console.error('OpenAI API Error:', {
            status: error?.status || error?.response?.status,
            statusText: error?.response?.statusText,
            code: error?.code,
            message: error?.message,
            data: error?.response?.data
        });
        return {
            text: "죄송합니다. AI 서비스 연결에 문제가 발생했습니다.",
            productIds: [],
            recipeId: null
        };
    }
};
