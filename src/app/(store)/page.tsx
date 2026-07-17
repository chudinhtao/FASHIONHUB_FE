'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/features/product/hooks';
import { ProductShort } from '@/types';
import { toast } from 'sonner';

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();

  // 1. Fetch top 8 products for New Arrivals
  const { data: response, isLoading, isError, refetch } = useProducts({ limit: 8, sortBy: 'newest' });
  const products: ProductShort[] = response?.data || [];

  // 2. Hero Banner Slideshow State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
      subtitle: t('home.hero.subtitle', 'BỘ SƯU TẬP MÙA HÈ 2026'),
      title: t('home.hero.title', 'Khai Phóng Sự Tinh Tế & Phóng Khoáng'),
      description: t('home.hero.description', 'Trải nghiệm phom dáng tối giản hiện đại được định hình từ các loại chất liệu dệt tự nhiên thượng hạng.'),
      cta: t('home.hero.cta', 'MUA NGAY'),
      link: '/products',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
      subtitle: t('home.hero2.subtitle', 'BỘ SƯU TẬP PRE-FALL'),
      title: t('home.hero2.title', 'SILENT LUXURY LOOKS'),
      description: t('home.hero2.description', 'Đỉnh cao thời trang may đo tinh xảo mang ngôn ngữ kiến trúc tối giản và thanh lịch vượt thời gian.'),
      cta: t('home.hero2.cta', 'KHÁM PHÁ NGAY'),
      link: '/products',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 3. Horizontal Products Slider scroll refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // 4. Testimonials carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      id: 1,
      text: t('home.testimonials.text1', '"Chất liệu linen dệt siêu thoáng mát và nhẹ tênh. Đường may vắt sổ tinh tế đúng đẳng cấp của một thương hiệu thời trang thiết kế cao cấp."'),
      author: 'Hoàng Anh - Hà Nội'
    },
    {
      id: 2,
      text: t('home.testimonials.text2', '"Áo sơ mi Oxford của hãng có phom dáng rất đứng, đứng dáng khi giặt không bị xù lông. Một sản phẩm tuyệt vời vô cùng xứng đáng với mức giá tiền."'),
      author: 'Khánh Nam - TP.HCM'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // 5. Wishlist toggle state
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const isAdded = !prev[productId];
      if (isAdded) {
        toast.success(t('product.toast.wishlistAdd', 'Đã thêm vào danh sách yêu thích!'));
      } else {
        toast.success(t('product.toast.wishlistRemove', 'Đã xóa khỏi danh sách yêu thích.'));
      }
      return { ...prev, [productId]: isAdded };
    });
  };

  // 6. Newsletter Form Submit
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();

    if (!email) {
      toast.error(t('home.newsletter.toastErrorEmpty', 'Vui lòng nhập địa chỉ email!'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('home.newsletter.toastErrorInvalid', 'Email không đúng định dạng. Vui lòng kiểm tra lại!'));
      return;
    }

    setSubmittingNewsletter(true);
    try {
      // Simulate API submit latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(t('home.newsletter.toastSuccess', 'Đăng ký nhận bản tin thành công!'));
      setNewsletterEmail('');
    } catch (error) {
      toast.error(t('home.newsletter.toastErrorServer', 'Đã xảy ra lỗi, vui lòng thử lại sau.'));
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-ink pb-12">
      {/* Inject custom hide scrollbar css rule locally */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* 1. Hero Banner Slideshow */}
      <section className="relative h-[600px] w-full bg-zinc-950 overflow-hidden select-none">
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-800 ease-in-out ${
                idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-5">
                <span className="text-[10px] text-primaryGold font-bold uppercase tracking-[0.35em] font-outfit">
                  {slide.subtitle}
                </span>
                <h2 className="font-playfair text-white text-4xl md:text-6xl font-bold uppercase tracking-wider leading-tight max-w-3xl">
                  {slide.title}
                </h2>
                <p className="text-xs text-zinc-300 font-light max-w-md tracking-wider leading-relaxed">
                  {slide.description}
                </p>
                <button
                  onClick={() => router.push(slide.link)}
                  className="bg-[#FFFFFF] text-[#000000] hover:bg-primaryGold hover:text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-none hover:-translate-y-[1px] cursor-pointer"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Slideshow arrows */}
        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white hover:text-primaryGold transition-colors p-2 bg-black/10 hover:bg-black/30 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white hover:text-primaryGold transition-colors p-2 bg-black/10 hover:bg-black/30 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2 h-2 rounded-full bg-white transition-opacity cursor-pointer ${
                idx === activeSlide ? 'opacity-100' : 'opacity-40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Featured Collections Grid (3 Columns Asymmetric) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-2 select-none mb-12">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.2em] font-outfit">
            {t('home.categories.subtitle', 'DANH MỤC TIÊU BIỂU')}
          </span>
          <h3 className="font-playfair text-2xl md:text-3xl font-bold tracking-wider text-ink">
            {t('home.categories.title', 'BỘ SƯU TẬP NỔI BẬT')}
          </h3>
          <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => router.push('/products?categorySlug=ao-nam')}
            className="relative group overflow-hidden bg-zinc-900 aspect-[3/4] cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80"
              alt="Ao Nam"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-8 left-8 text-white z-10 space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Collection</span>
              <h4 className="font-playfair text-2xl font-bold tracking-wider">{t('home.categories.mens', 'ĐỒ NAM')}</h4>
              <span className="text-[10px] text-white/80 font-outfit tracking-widest uppercase block pt-2 group-hover:text-primaryGold transition-colors">
                {t('home.categories.explore', 'Xem Ngay >')}
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => router.push('/products?categorySlug=ao-polo')}
            className="relative group overflow-hidden bg-zinc-900 aspect-[3/4] cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"
              alt="Ao Polo"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-8 left-8 text-white z-10 space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Collection</span>
              <h4 className="font-playfair text-2xl font-bold tracking-wider">{t('home.categories.polos', 'ÁO POLO')}</h4>
              <span className="text-[10px] text-white/80 font-outfit tracking-widest uppercase block pt-2 group-hover:text-primaryGold transition-colors">
                {t('home.categories.explore', 'Xem Ngay >')}
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => router.push('/products?categorySlug=phu-kien')}
            className="relative group overflow-hidden bg-zinc-900 aspect-[3/4] cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&q=80"
              alt="Phu Kien"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-8 left-8 text-white z-10 space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Collection</span>
              <h4 className="font-playfair text-2xl font-bold tracking-wider">{t('home.categories.accessories', 'PHỤ KIỆN')}</h4>
              <span className="text-[10px] text-white/80 font-outfit tracking-widest uppercase block pt-2 group-hover:text-primaryGold transition-colors">
                {t('home.categories.explore', 'Xem Ngay >')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Brand Story Narrative */}
      <section className="w-full bg-[#FAF9F6] border-y border-borderGray select-none">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="Craftsmanship Story"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.25em] font-outfit block">
              {t('home.story.badge', 'BẢN SẮC CỦA CHÚNG TÔI')}
            </span>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-ink leading-tight">
              {t('home.story.title', 'Sự Kỹ Lưỡng Tạo Nên Độc Bản')}
            </h3>
            <p className="text-sm text-charcoal leading-relaxed font-light font-outfit">
              {t('home.story.description', 'FashionHub tự hào về triết lý sản xuất bền vững và may đo tinh xảo. Mỗi thước vải Linen, Cotton hữu cơ hay Lụa tơ tằm đều được lựa chọn khắt khe và chế tác từ bàn tay của những thợ thủ công lành nghề. Chúng tôi tôn sùng vẻ đẹp tối giản, bền vững và chống lại xu hướng thời trang nhanh.')}
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-block border-b border-ink pb-1 text-xs font-bold font-outfit tracking-widest uppercase text-ink hover:text-primaryGold hover:border-primaryGold transition-all"
              >
                {t('home.story.cta', 'ĐỌC TIẾP CÂU CHUYỆN >')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Slider / New Arrivals */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="flex items-center justify-between select-none mb-12">
          <div className="space-y-1">
            <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.2em] font-outfit">
              {t('home.arrivals.subtitle', 'BỘ SƯU TẬP MỚI VỀ')}
            </span>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold tracking-wider text-ink">
              {t('home.arrivals.title', 'SẢN PHẨM MỚI VỀ')}
            </h3>
          </div>
          {/* Scroll slider button controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollSlider('left')}
              className="w-10 h-10 border border-borderGray flex items-center justify-center text-ink hover:border-primaryGold hover:text-primaryGold transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="w-10 h-10 border border-borderGray flex items-center justify-center text-ink hover:border-primaryGold hover:text-primaryGold transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider list */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto hide-scrollbar py-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="min-w-[280px] md:min-w-[300px] border border-borderGray p-4 space-y-4">
                <div className="w-full aspect-[3/4] bg-zinc-100 animate-pulse" />
                <div className="h-3 w-1/3 bg-zinc-200 animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-200 animate-pulse" />
                <div className="h-4 w-1/4 bg-zinc-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="border border-red-200 bg-red-50 p-6 text-center text-xs text-error font-semibold">
            <span>{t('catalog.state.errorTitle', 'Không thể tải danh sách sản phẩm')}</span>
            <button onClick={() => refetch()} className="underline ml-2 hover:text-red-700 cursor-pointer">
              {t('catalog.state.retry', 'Thử Lại')}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-xs text-charcoal">
            {t('catalog.state.emptyTitle', 'Không tìm thấy sản phẩm phù hợp')}
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory py-4"
          >
            {products.map((product) => {
              const isFav = !!wishlist[product.id];
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="min-w-[280px] md:min-w-[290px] snap-start bg-white border border-borderGray p-4 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-primaryGold transition-all duration-300 relative"
                >
                  <div>
                    <div className="w-full aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden relative">
                      <img
                        src={product.primaryImage || 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      
                      {/* Heart Wishlist button */}
                      <button
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                      >
                        <svg
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'fill-red-500 text-red-500' : 'fill-none text-charcoal'
                          }`}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>

                      {/* Quick Add trigger (Navigates to detail for variant choice) */}
                      <div className="absolute bottom-0 left-0 w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm border-t border-borderGray">
                        <span className="w-full block text-center bg-[#000000] text-white hover:bg-primaryGold transition-all duration-300 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-none">
                          + {t('product.cta.addToCart', 'THÊM NHANH')}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-charcoal font-semibold uppercase tracking-wider font-outfit">
                      {product.category?.name}
                    </span>
                    <h4 className="font-outfit text-sm font-medium text-ink mt-1 line-clamp-1">{product.name}</h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-borderGray flex items-baseline justify-between">
                    <span className="text-sm font-semibold font-mono text-primaryGold">
                      {Number(product.price).toLocaleString('vi-VN')} ₫
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-charcoal line-through font-mono">
                        {Number(product.originalPrice).toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Editorial Lookbook (Asymmetric Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-borderGray">
        <div className="text-center space-y-2 select-none mb-12">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.2em] font-outfit">
            {t('home.lookbook.badge', 'ẤN PHẨM KHÔNG GIAN')}
          </span>
          <h3 className="font-playfair text-2xl md:text-3xl font-bold tracking-wider text-ink">
            {t('home.lookbook.title', 'LOOKBOOK THỜI TRANG 2026')}
          </h3>
          <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
          {/* Item 1 */}
          <div
            onClick={() => router.push('/products')}
            className="relative bg-zinc-100 overflow-hidden md:col-span-5 md:row-span-3 cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
              alt="Lookbook 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-6 left-6 z-20 text-white space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Style 01</span>
              <h4 className="font-playfair text-xl font-bold tracking-wider">
                {t('home.lookbook.styles.style1', 'Nắng Vàng Cổ Điển')}
              </h4>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => router.push('/products')}
            className="relative bg-zinc-100 overflow-hidden md:col-span-7 md:row-span-2 cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&q=80"
              alt="Lookbook 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-6 left-6 z-20 text-white space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Style 02</span>
              <h4 className="font-playfair text-xl font-bold tracking-wider">
                {t('home.lookbook.styles.style2', 'Hương Vị Biển Khơi')}
              </h4>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => router.push('/products')}
            className="relative bg-zinc-100 overflow-hidden md:col-span-3 md:row-span-1 cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&q=80"
              alt="Lookbook 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-4 left-4 z-20 text-white space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Style 03</span>
              <h4 className="font-playfair text-lg font-bold tracking-wider">
                {t('home.lookbook.styles.style3', 'Đơn Sắc Thanh Lịch')}
              </h4>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => router.push('/products')}
            className="relative bg-zinc-100 overflow-hidden md:col-span-4 md:row-span-1 cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80"
              alt="Lookbook 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-4 left-4 z-20 text-white space-y-1">
              <span className="text-[9px] text-primaryGold font-medium tracking-widest font-outfit uppercase">Style 04</span>
              <h4 className="font-playfair text-lg font-bold tracking-wider">
                {t('home.lookbook.styles.style4', 'Hoàng Hôn Ấm Áp')}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials (Slider) */}
      <section className="w-full bg-[#FCFCFB] border-t border-borderGray select-none">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.2em] font-outfit block">
            {t('home.testimonials.badge', 'ĐÁNH GIÁ TIÊU BIỂU')}
          </span>

          <div className="relative h-[180px] md:h-[150px]">
            {testimonials.map((t, idx) => (
              <div
                key={t.id}
                className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center space-y-4 ${
                  idx === activeTestimonial ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="flex space-x-1.5 text-primaryGold justify-center">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="font-playfair text-lg md:text-xl text-ink leading-relaxed max-w-2xl italic">
                  {t.text}
                </p>
                <div className="text-xs text-charcoal font-outfit uppercase tracking-widest pt-2">
                  {t.author}
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center space-x-2 pt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2 h-2 rounded-full bg-primaryGold transition-all cursor-pointer ${
                  idx === activeTestimonial ? 'opacity-100' : 'opacity-30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Instagram Grid (Social Wall) */}
      <section className="w-full border-t border-borderGray">
        <div className="text-center space-y-2 select-none py-16">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.2em] font-outfit">
            KẾT NỐI VỚI CHÚNG TÔI
          </span>
          <h3 className="font-playfair text-2xl font-bold tracking-wider text-ink">@FASHIONHUB.OFFICIAL</h3>
          <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <div className="relative aspect-square overflow-hidden group bg-zinc-900 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
              alt="Instagram 1"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest font-outfit font-light opacity-0 group-hover:opacity-100 transition-opacity">
                Xem bài viết
              </span>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden group bg-zinc-900 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80"
              alt="Instagram 2"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest font-outfit font-light opacity-0 group-hover:opacity-100 transition-opacity">
                Xem bài viết
              </span>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden group bg-zinc-900 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80"
              alt="Instagram 3"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest font-outfit font-light opacity-0 group-hover:opacity-100 transition-opacity">
                Xem bài viết
              </span>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden group bg-zinc-900 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=500&q=80"
              alt="Instagram 4"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest font-outfit font-light opacity-0 group-hover:opacity-100 transition-opacity">
                Xem bài viết
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Signup */}
      <section className="w-full bg-[#FAF9F6] border-t border-borderGray select-none">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.25em] font-outfit block">
            {t('home.newsletter.badge', 'BẢN TIN THƯƠNG HIỆU')}
          </span>
          <h3 className="font-playfair text-3xl font-bold text-ink">
            {t('home.newsletter.title', 'Đăng ký để nhận tin ưu đãi')}
          </h3>
          <p className="text-xs text-charcoal leading-relaxed font-light font-outfit max-w-md mx-auto">
            {t('home.newsletter.description', 'Nhận thông tin cập nhật sớm nhất về các sản phẩm mới và chiến dịch độc quyền từ cửa hàng thời trang FashionHub.')}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={t('home.newsletter.placeholder', 'Nhập địa chỉ email của bạn...')}
              className="flex-1 bg-transparent border-b border-zinc-400 focus:border-primaryGold focus:outline-none py-3 text-sm font-outfit tracking-wide"
              disabled={submittingNewsletter}
            />
            <button
              type="submit"
              className="bg-[#000000] text-white hover:bg-primaryGold transition-all duration-300 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-none hover:-translate-y-[1px] cursor-pointer disabled:opacity-50"
              disabled={submittingNewsletter}
            >
              {submittingNewsletter
                ? t('auth.loading', 'Đang xử lý...')
                : t('home.newsletter.cta', 'ĐĂNG KÝ')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
