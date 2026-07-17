import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Form } from 'antd';
import { useCheckoutView } from '../hooks';
import { Input } from '@/components/ui/Input';
import { CheckoutFormValues } from './CheckoutForm.schema';

export const CheckoutForm: React.FC = () => {
  const { t } = useCheckoutView();
  const {
    control,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  return (
    <div className="checkout-form-container w-full pr-14 border-r border-border-light max-md:pr-0 max-md:border-r-0">
      {/* Header of Column 1 */}
      <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
        <h1 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">
          {t('orders.checkout.shippingHeader', 'Shipping Details')}
        </h1>
      </div>

      <Form layout="vertical" requiredMark={false} className="space-y-4">
        {/* Recipient Name */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-charcoal font-bold">{t('orders.checkout.fullName', 'Họ và tên người nhận *')}</span>}
          validateStatus={errors.recipientName ? 'error' : ''}
          help={errors.recipientName && t(errors.recipientName.message || '', 'Họ tên phải từ 2 ký tự trở lên.')}
          className="!mb-0"
        >
          <Controller
            name="recipientName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('orders.checkout.fullNamePlaceholder', 'Nhập họ và tên đầy đủ')}
                className="elegant-input h-[42px]"
              />
            )}
          />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-charcoal font-bold">{t('orders.checkout.phone', 'Số điện thoại *')}</span>}
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone && t(errors.phone.message || '', 'Số điện thoại 10 số, bắt đầu bằng 03, 05, 07, 08, hoặc 09.')}
          className="!mb-0"
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('orders.checkout.phonePlaceholder', 'Nhập số điện thoại liên hệ')}
                className="elegant-input h-[42px]"
              />
            )}
          />
        </Form.Item>

        {/* Shipping Address */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-charcoal font-bold">{t('orders.checkout.address', 'Địa chỉ nhận hàng *')}</span>}
          validateStatus={errors.shippingAddress ? 'error' : ''}
          help={errors.shippingAddress && t(errors.shippingAddress.message || '', 'Địa chỉ chi tiết tối thiểu 10 ký tự.')}
          className="!mb-0"
        >
          <Controller
            name="shippingAddress"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('orders.checkout.addressPlaceholder', 'Số nhà, tên đường, phường/xã, quận/huyện, thành phố')}
                className="elegant-input h-[42px]"
              />
            )}
          />
        </Form.Item>

        {/* Notes */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-charcoal font-bold">{t('orders.checkout.notes', 'Ghi chú đơn hàng (Không bắt buộc)')}</span>}
          className="!mb-0"
        >
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('orders.checkout.notesPlaceholder', 'Ví dụ: Giao giờ hành chính, gọi trước khi giao')}
                className="elegant-input h-[42px]"
              />
            )}
          />
        </Form.Item>

        {/* COD payment notice */}
        <div className="payment-notice bg-surface-light p-4 border-l-2 border-gold text-xs text-charcoal tracking-wide !mt-8">
          <strong>{t('orders.checkout.paymentHeader', 'Thanh toán COD:')}</strong>{' '}
          {t('orders.checkout.codNotice', 'Bạn sẽ thanh toán tiền mặt trực tiếp cho nhân viên vận chuyển sau khi kiểm tra hàng.')}
        </div>
      </Form>
    </div>
  );
};
