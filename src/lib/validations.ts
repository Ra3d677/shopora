import { z } from 'zod';

// ─── Auth Validations ───────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// ─── Store Validations ──────────────────────────────────────────
export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  template: z.string().optional(),
  type: z.enum(['STORE', 'WEBSITE']).optional().default('STORE'),
});

export const updateStoreSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  template: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional(),
  isActive: z.boolean().optional(),
});

// ─── Product Validations ────────────────────────────────────────
const colorVariantSchema = z.object({
  name: z.string().min(1),
  value: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  imageUrl: z.string().url().nullable(),
  stock: z.number().int().nonnegative().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().positive('Price must be positive'),
  discount_price: z.number().positive().optional().nullable(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  sizes: z.array(z.string()),
  colors: z.array(colorVariantSchema),
  category_id: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'draft', 'archived']).optional().default('active'),
  stock_quantity: z.number().int().nonnegative().default(0),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Category Validations ───────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

// ─── Order Validations ──────────────────────────────────────────
export const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(5, 'Phone number is required'),
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  notes: z.string().optional().nullable(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    size: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
  })).min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded', 'failed']).optional(),
});

// ─── Coupon Validations ─────────────────────────────────────────
export const createCouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters')
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, 'Code must contain only uppercase letters, numbers, hyphens, and underscores'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrder: z.number().nonnegative().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
});

// ─── Review Validations ─────────────────────────────────────────
export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  comment: z.string().max(1000).optional().nullable(),
  customerName: z.string().min(1, 'Name is required').max(100),
  customerEmail: z.string().email().optional().nullable(),
});

// ─── Banner Validations ─────────────────────────────────────────
export const createBannerSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  mobileImageUrl: z.string().url().optional().nullable(),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional().nullable(),
  buttonText: z.string().max(100).optional().nullable(),
  buttonLink: z.string().max(500).optional().nullable(),
  showButton: z.boolean().optional(),
  buttonPosition: z.enum(['left', 'center', 'right']).optional(),
  buttonShape: z.string().optional(),
  buttonColor: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  position: z.string().optional(),
  targetPage: z.string().optional(),
});

// ─── Contact / Newsletter Validations ───────────────────────────
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ─── Checkout Validations ───────────────────────────────────────
export const checkoutSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(5, 'Phone is required'),
  shippingAddress: z.string().min(5, 'Address is required'),
  notes: z.string().optional().nullable(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  couponCode: z.string().optional().nullable(),
});

// ─── Utility: Wrapped validation function ───────────────────────
import type { NextRequest } from 'next/server';

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; status: number };

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
    .join(', ');
}

export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return { success: false, error: formatZodError(result.error), status: 400 };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON body', status: 400 };
  }
}

export function validateData<T>(data: unknown, schema: z.ZodSchema<T>): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: formatZodError(result.error), status: 400 };
  }
  return { success: true, data: result.data };
}
