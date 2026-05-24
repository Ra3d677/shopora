import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  createStoreSchema,
  createProductSchema,
  createOrderSchema,
  createCouponSchema,
  createReviewSchema,
  contactSchema,
  newsletterSchema,
  validateData,
} from '../src/lib/validations';

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should accept valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short name', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        name: 'A',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Store Validations', () => {
  describe('createStoreSchema', () => {
    it('should accept valid store data', () => {
      const result = createStoreSchema.safeParse({
        name: 'My Store',
        slug: 'my-store',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug', () => {
      const result = createStoreSchema.safeParse({
        name: 'My Store',
        slug: 'My Store With Spaces',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = createStoreSchema.safeParse({
        name: '',
        slug: 'my-store',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Product Validations', () => {
  describe('createProductSchema', () => {
    const validProduct = {
      name: 'Test Product',
      price: 29.99,
      images: ['https://example.com/image.jpg'],
      sizes: ['M', 'L'],
      colors: [{ name: 'Red', value: '#FF0000', imageUrl: null }],
      category_id: 'some-category-id',
      stock_quantity: 10,
    };

    it('should accept valid product data', () => {
      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const result = createProductSchema.safeParse({
        ...validProduct,
        price: -10,
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = createProductSchema.safeParse({
        ...validProduct,
        name: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty images array', () => {
      const result = createProductSchema.safeParse({
        ...validProduct,
        images: [],
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Order Validations', () => {
  describe('createOrderSchema', () => {
    const validOrder = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+201234567890',
      shippingAddress: '123 Main St, Cairo, Egypt',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          price: 29.99,
        },
      ],
    };

    it('should accept valid order data', () => {
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should reject empty items array', () => {
      const result = createOrderSchema.safeParse({
        ...validOrder,
        items: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = createOrderSchema.safeParse({
        customerName: 'John Doe',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Coupon Validations', () => {
  describe('createCouponSchema', () => {
    it('should accept valid coupon', () => {
      const result = createCouponSchema.safeParse({
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
      });
      expect(result.success).toBe(true);
    });

    it('should reject lowercase code', () => {
      const result = createCouponSchema.safeParse({
        code: 'save20',
        discountType: 'percentage',
        discountValue: 20,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Review Validations', () => {
  describe('createReviewSchema', () => {
    it('should accept valid review', () => {
      const result = createReviewSchema.safeParse({
        rating: 5,
        customerName: 'John Doe',
        comment: 'Great product!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject rating > 5', () => {
      const result = createReviewSchema.safeParse({
        rating: 6,
        customerName: 'John Doe',
      });
      expect(result.success).toBe(false);
    });

    it('should reject rating < 1', () => {
      const result = createReviewSchema.safeParse({
        rating: 0,
        customerName: 'John Doe',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Contact & Newsletter Validations', () => {
  describe('contactSchema', () => {
    it('should accept valid contact', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I have a question about your products.',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short message', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hi',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('newsletterSchema', () => {
    it('should accept valid email', () => {
      const result = newsletterSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = newsletterSchema.safeParse({
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('validateData utility', () => {
  it('should return success for valid data', () => {
    const result = validateData(
      { email: 'test@example.com', password: 'password123' },
      loginSchema
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('should return error for invalid data', () => {
    const result = validateData(
      { email: 'invalid', password: '123' },
      loginSchema
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
      expect(result.status).toBe(400);
    }
  });
});