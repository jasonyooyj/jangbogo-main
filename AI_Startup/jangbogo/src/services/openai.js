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
When a user asks about products, check the inventory and provide relevant information including price and location.
If a product is not in the inventory, suggest similar items or apologize.
Always be polite and concise.

Current Product Inventory:
${JSON.stringify(PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    section: p.section
})))}

Available Recipes:
${JSON.stringify(RECIPES.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    ingredients: r.ingredients.map(ing => ing.name),
    relatedProductIds: r.relatedProductIds
})))}

If the user asks for a recipe (e.g., "떡볶이 레시피", "스테이크 만드는 법"), recommend a matching recipe from the Available Recipes list.
If the user asks about ingredients for a recipe, mention the recipe and its required ingredients from the Available Recipes.

IMPORTANT: At the end of your response, if you mentioned any products or recipes, add a JSON block in this format:
[PRODUCT_IDS]
{"productIds": [1, 2, 3], "recipeId": 1}
[/PRODUCT_IDS]

- productIds: Array of product IDs from the inventory (empty array if no products)
- recipeId: Recipe ID if you mentioned a recipe (null if no recipe)

If neither products nor recipes are mentioned, omit this JSON block entirely.
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
        console.error('OpenAI API Error:', error);
        return {
            text: "죄송합니다. AI 서비스 연결에 문제가 발생했습니다.",
            productIds: [],
            recipeId: null
        };
    }
};
