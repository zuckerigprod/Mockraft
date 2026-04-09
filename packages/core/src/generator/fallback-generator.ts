import type { ParsedSchema } from "../parser/types.js";

let counter = 1;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const FIRST_NAMES_EN = ["James", "Emma", "Oliver", "Sophia", "William", "Ava", "Benjamin", "Isabella", "Lucas", "Mia"];
const LAST_NAMES_EN = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"];
const FIRST_NAMES_RU = ["Александр", "Мария", "Дмитрий", "Анна", "Максим", "Елена", "Артём", "Ольга", "Иван", "Наталья"];
const LAST_NAMES_RU = ["Иванов", "Петров", "Сидоров", "Козлов", "Новиков", "Морозов", "Волков", "Соколов", "Попов", "Лебедев"];
const DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "mail.com", "proton.me"];
const SPECIES = ["dog", "cat", "bird", "fish", "hamster"];
const PET_NAMES = ["Buddy", "Luna", "Charlie", "Bella", "Max", "Lucy", "Cooper", "Daisy", "Rocky", "Sadie"];
const CITIES_EN = ["New York", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Toronto", "Moscow", "Dubai", "Singapore"];
const STREETS_EN = ["Main St", "Oak Ave", "Cedar Ln", "Elm Dr", "Pine Rd", "Maple Ct", "Washington Blvd", "Park Ave"];
const COMPANIES = ["Acme Corp", "Globex", "Initech", "Umbrella Inc", "Stark Industries", "Wayne Enterprises"];

function generateByFieldName(name: string, locale: string): unknown {
  const lower = name.toLowerCase();
  const isRu = locale === "ru";
  const firstNames = isRu ? FIRST_NAMES_RU : FIRST_NAMES_EN;
  const lastNames = isRu ? LAST_NAMES_RU : LAST_NAMES_EN;

  if (lower === "id" || lower.endsWith("id") || lower.endsWith("_id")) return uuid();
  if (lower === "name" || lower === "fullname" || lower === "full_name") return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
  if (lower === "firstname" || lower === "first_name") return randomElement(firstNames);
  if (lower === "lastname" || lower === "last_name") return randomElement(lastNames);
  if (lower === "email" || lower.endsWith("email")) return `${randomElement(firstNames).toLowerCase()}${randomInt(1, 99)}@${randomElement(DOMAINS)}`;
  if (lower === "phone" || lower === "telephone") return `+${randomInt(1, 9)}${Array.from({ length: 10 }, () => randomInt(0, 9)).join("")}`;
  if (lower === "avatar" || lower === "image" || lower === "photo") return `https://i.pravatar.cc/150?u=${counter++}`;
  if (lower === "url" || lower === "website" || lower === "homepage") return `https://example.com/${randomElement(firstNames).toLowerCase()}`;
  if (lower === "address" || lower === "street") return `${randomInt(1, 999)} ${randomElement(STREETS_EN)}`;
  if (lower === "city") return randomElement(CITIES_EN);
  if (lower === "country") return isRu ? "Россия" : "United States";
  if (lower === "company" || lower === "organization") return randomElement(COMPANIES);
  if (lower === "title" || lower === "subject") return `Item #${counter++}`;
  if (lower === "description" || lower === "bio" || lower === "about") return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  if (lower === "age") return randomInt(18, 65);
  if (lower === "price" || lower === "amount" || lower === "cost") return +(Math.random() * 1000).toFixed(2);
  if (lower === "rating" || lower === "score") return +(Math.random() * 5).toFixed(1);
  if (lower === "status") return randomElement(["active", "inactive", "pending"]);
  if (lower === "role") return randomElement(["admin", "user", "moderator"]);
  if (lower === "species" || lower === "type") return randomElement(SPECIES);
  if (lower === "owner") return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
  if (lower === "tag" || lower === "category") return randomElement(["general", "tech", "science", "art"]);

  return undefined;
}

function generateByFormat(format: string): unknown {
  switch (format) {
    case "uuid": return uuid();
    case "email": return `user${randomInt(1, 999)}@${randomElement(DOMAINS)}`;
    case "uri":
    case "url": return `https://example.com/${randomInt(1000, 9999)}`;
    case "date-time": return new Date(Date.now() - randomInt(0, 365 * 24 * 60 * 60 * 1000)).toISOString();
    case "date": return new Date(Date.now() - randomInt(0, 365 * 24 * 60 * 60 * 1000)).toISOString().split("T")[0];
    case "time": return `${String(randomInt(0, 23)).padStart(2, "0")}:${String(randomInt(0, 59)).padStart(2, "0")}:00`;
    case "ipv4": return `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
    case "ipv6": return Array.from({ length: 8 }, () => randomInt(0, 65535).toString(16)).join(":");
    default: return undefined;
  }
}

export function generateFallbackValue(schema: ParsedSchema, fieldName: string = "", locale: string = "en"): unknown {
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  if (schema.enum) return randomElement(schema.enum);

  if (schema.type === "array" && schema.items) {
    const count = randomInt(1, 5);
    return Array.from({ length: count }, () => generateFallbackValue(schema.items!, fieldName, locale));
  }

  if (schema.type === "object" && schema.properties) {
    const obj: Record<string, unknown> = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      obj[key] = generateFallbackValue(prop, key, locale);
    }
    return obj;
  }

  const byName = generateByFieldName(fieldName, locale);
  if (byName !== undefined) return byName;

  if (schema.format) {
    const byFormat = generateByFormat(schema.format);
    if (byFormat !== undefined) return byFormat;
  }

  switch (schema.type) {
    case "string": return `${fieldName || "value"}_${counter++}`;
    case "integer":
    case "number": {
      const min = schema.minimum ?? 0;
      const max = schema.maximum ?? 1000;
      return schema.type === "integer" ? randomInt(min, max) : +(Math.random() * (max - min) + min).toFixed(2);
    }
    case "boolean": return Math.random() > 0.5;
    default: return null;
  }
}

export function generateFallbackData(schema: ParsedSchema, count: number = 3, locale: string = "en"): unknown[] {
  return Array.from({ length: count }, () => generateFallbackValue(schema, "", locale));
}
