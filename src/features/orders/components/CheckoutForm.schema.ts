import { z } from 'zod';

export const checkoutFormSchema = z.object({
  recipientName: z
    .string()
    .min(2, { message: 'orders.checkout.errors.nameMin' })
    .max(50, { message: 'orders.checkout.errors.nameMax' }),
  phone: z
    .string()
    .regex(/^(03|05|07|08|09)\d{8}$/, { message: 'orders.checkout.errors.phoneInvalid' }),
  shippingAddress: z
    .string()
    .min(10, { message: 'orders.checkout.errors.addressMin' })
    .max(255, { message: 'orders.checkout.errors.addressMax' }),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
