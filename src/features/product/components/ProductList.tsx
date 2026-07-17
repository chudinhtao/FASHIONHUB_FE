'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProductList } from '../hooks';
import { Category } from '@/types';
import { Input, Button } from '@/components/ui';
import { Checkbox, Pagination, Slider } from 'antd';
import { getImageUrl } from '@/lib/utils';
import { DownOutlined, CheckOutlined, PlusOutlined, MinusOutlined, RightOutlined, TagOutlined } from '@ant-design/icons';

export default function ProductList() {
  const {
    t,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    categorySlug,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    search,
    setSearch,
    onlySale,
    setOnlySale,
    color,
    setColor,
    size,
    setSize,
    categories,
    isCategoriesLoading,
    products,
    isProductsLoading,
    isError,
    refetch,
    meta,
    handleCategorySelect,
    clearAllFilters,
  } = useProductList();

  const [openSearch, setOpenSearch] = React.useState(false);
  const [openCategories, setOpenCategories] = React.useState(false);
  const [openPrice, setOpenPrice] = React.useState(false);
  const [openColor, setOpenColor] = React.useState(false);
  const [openSize, setOpenSize] = React.useState(false);
  const [showAllCategories, setShowAllCategories] = React.useState(false);

  const visibleCategories = showAllCategories
    ? categories || []
    : (categories || []).slice(0, 3);

  const availableColors: { label: string; value: string }[] = [
    { label: t('color.white', 'Trắng'), value: 'White' },
    { label: t('color.black', 'Đen'), value: 'Black' },
    { label: t('color.navy', 'Xanh Navy'), value: 'Navy' },
    { label: t('color.red', 'Đỏ'), value: 'Red' },
    { label: t('color.beige', 'Kem'), value: 'Beige' },
    { label: t('color.grey', 'Xám'), value: 'Grey' },
    { label: t('color.green', 'Xanh Rêu'), value: 'Green' },
    { label: t('color.brown', 'Nâu'), value: 'Brown' },
    { label: t('color.pink', 'Hồng'), value: 'Pink' },
    { label: t('color.gold', 'Vàng'), value: 'Gold' },
  ];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '29', '30', '31', '32', '33', 'Free Size'];

  const getColorHex = (value: string) => {
    const v = value.toLowerCase();
    if (v === 'black') return '#1A1A1A';
    if (v === 'white') return '#FFFFFF';
    if (v === 'red') return '#9B2335';
    if (v === 'navy') return '#1E3E62';
    if (v === 'grey' || v === 'gray') return '#808080';
    if (v === 'beige') return '#F5F0E8';
    if (v === 'green') return '#4A5D4E';
    if (v === 'brown') return '#8B5A2B';
    if (v === 'pink') return '#FFC0CB';
    if (v === 'gold') return '#C5A880';
    return '#E4E4E7';
  };

  // Recursive category renderer for sidebar
  const renderCategoryNode = (cat: Category) => {
    const isActive = categorySlug === cat.slug;
    const hasChildren = cat.children && cat.children.length > 0;

    return (
      <div key={cat.id} className="space-y-1">
        <div
          onClick={() => handleCategorySelect(cat.slug)}
          className={`flex items-center justify-between py-1 cursor-pointer transition-colors text-xs font-outfit ${
            isActive ? 'text-primaryGold font-semibold' : 'text-charcoal hover:text-ink'
          }`}
        >
          <span className="flex items-center gap-2">
            <RightOutlined className={`text-[7px] transition-transform ${isActive ? 'text-primaryGold rotate-90' : 'opacity-40'}`} />
            {cat.name.toUpperCase()}
          </span>
          {isActive && <CheckOutlined className="text-[9px] text-primaryGold font-bold" />}
        </div>
        {hasChildren && (
          <div className="pl-3.5 border-l border-borderGray ml-1.5 space-y-1">
            {cat.children!.map((child) => renderCategoryNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-bgLight min-h-screen text-ink pb-16">
      <main className="max-w-7xl w-full mx-auto px-6 pt-4 pb-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filter Column */}
        <aside className="w-full md:w-[250px] shrink-0 space-y-8 select-none">
          {/* Breadcrumbs */}
          <div className="text-[10px] uppercase tracking-wider text-charcoal font-outfit">
            <Link href="/" className="hover:text-ink">
              {t('catalog.breadcrumbs.home', 'Trang chủ')}
            </Link>
            <span className="mx-2 text-borderGray">/</span>
            <span className="text-ink font-semibold">{t('catalog.breadcrumbs.shop', 'Cửa hàng')}</span>
          </div>

          {/* Search bar inside sidebar */}
          <div className="space-y-3 pt-4 border-t border-borderGray">
            <div
              onClick={() => setOpenSearch(!openSearch)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink group-hover:text-primaryGold transition-colors">
                {t('catalog.filter.search', 'Tìm Kiếm')}
              </h3>
              <DownOutlined className={`text-[9px] text-charcoal transition-transform duration-300 ${openSearch ? 'rotate-180' : ''}`} />
            </div>
            {openSearch && (
              <Input
                placeholder={t('catalog.filter.searchPlaceholder', 'Tìm sản phẩm...')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                allowClear
                className="w-full rounded-none font-outfit text-xs mt-2"
              />
            )}
          </div>

          {/* Sale Filter Checkbox */}
          <div className="space-y-3 pt-4 border-t border-borderGray select-none">
            <Checkbox
              checked={onlySale}
              onChange={(e) => {
                setOnlySale(e.target.checked);
                setCurrentPage(1);
              }}
              className="text-xs font-outfit font-bold uppercase tracking-wider text-red-800 hover:text-red-900 select-none cursor-pointer flex items-center"
            >
              <span className="inline-flex items-center gap-1.5">
                <TagOutlined className="text-[11px]" />
                {t('catalog.filter.onlySale', 'SẢN PHẨM KHUYẾN MÃI')}
              </span>
            </Checkbox>
          </div>

          {/* Categories Hierarchical List */}
          <div className="space-y-3 pt-6 border-t border-borderGray">
            <div
              onClick={() => setOpenCategories(!openCategories)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink group-hover:text-primaryGold transition-colors">
                {t('catalog.filter.categories', 'Danh Mục')}
              </h3>
              <DownOutlined className={`text-[9px] text-charcoal transition-transform duration-300 ${openCategories ? 'rotate-180' : ''}`} />
            </div>
            {openCategories && (
              <div className="space-y-2 mt-2">
                {isCategoriesLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-zinc-100 animate-pulse"></div>
                    <div className="h-4 w-32 bg-zinc-100 animate-pulse pl-4"></div>
                    <div className="h-4 w-24 bg-zinc-100 animate-pulse"></div>
                  </div>
                ) : categories && categories.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {visibleCategories.map((cat) => renderCategoryNode(cat))}
                    </div>
                    {categories.length > 3 && (
                      <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="flex items-center gap-1.5 text-[9px] font-outfit font-bold uppercase tracking-widest text-primaryGold hover:text-ink transition-colors pt-2.5 cursor-pointer border-none bg-transparent"
                      >
                        {showAllCategories ? (
                          <>
                            {t('catalog.categories.showLess', 'Thu gọn')} <MinusOutlined className="text-[8px]" />
                          </>
                        ) : (
                          <>
                            {t('catalog.categories.showMore', 'Xem thêm')} <PlusOutlined className="text-[8px]" />
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-charcoal italic">{t('catalog.filter.noCategories', 'Không có danh mục')}</p>
                )}
              </div>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-6 border-t border-borderGray">
            <div
              onClick={() => setOpenPrice(!openPrice)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink group-hover:text-primaryGold transition-colors">
                {t('catalog.filter.price', 'Khoảng Giá')}
              </h3>
              <DownOutlined className={`text-[9px] text-charcoal transition-transform duration-300 ${openPrice ? 'rotate-180' : ''}`} />
            </div>
            {openPrice && (
              <div className="space-y-4 mt-4 px-2">
                <Slider
                  range
                  min={0}
                  max={2000000}
                  step={50000}
                  value={[minPrice, maxPrice]}
                  onChange={(val: number[]) => {
                    setMinPrice(val[0]);
                    setMaxPrice(val[1]);
                    setCurrentPage(1);
                  }}
                  tooltip={{
                    formatter: (val) => `${val?.toLocaleString('vi-VN')} ₫`
                  }}
                  trackStyle={[{ backgroundColor: '#C5A880' }]}
                  handleStyle={[
                    { borderColor: '#C5A880', backgroundColor: '#fff' },
                    { borderColor: '#C5A880', backgroundColor: '#fff' }
                  ]}
                />
                <div className="flex justify-between items-center text-[11px] font-mono text-charcoal">
                  <span>{minPrice.toLocaleString('vi-VN')} ₫</span>
                  <span>{maxPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            )}
          </div>

          {/* Color Filter Swatches */}
          <div className="space-y-3 pt-6 border-t border-borderGray">
            <div
              onClick={() => setOpenColor(!openColor)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink group-hover:text-primaryGold transition-colors">
                {t('catalog.filter.color', 'Màu Sắc')}
              </h3>
              <DownOutlined className={`text-[9px] text-charcoal transition-transform duration-300 ${openColor ? 'rotate-180' : ''}`} />
            </div>
            {openColor && (
              <div className="flex flex-wrap gap-2 mt-2">
                {availableColors.map(({ label, value: colorVal }) => {
                  const isActive = color === colorVal;
                  const hex = getColorHex(colorVal);
                  return (
                    <button
                      key={colorVal}
                      onClick={() => {
                        setColor(isActive ? '' : colorVal);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-outfit tracking-wider uppercase border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-primaryGold bg-primaryGold/10 text-primaryGold shadow-sm font-semibold'
                          : 'border-border-light bg-white text-charcoal hover:border-ink hover:text-ink'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Size Filter Tiles */}
          <div className="space-y-3 pt-6 border-t border-borderGray">
            <div
              onClick={() => setOpenSize(!openSize)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink group-hover:text-primaryGold transition-colors">
                {t('catalog.filter.size', 'Kích Cỡ')}
              </h3>
              <DownOutlined className={`text-[9px] text-charcoal transition-transform duration-300 ${openSize ? 'rotate-180' : ''}`} />
            </div>
            {openSize && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {availableSizes.map((s) => {
                  const isActive = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSize(isActive ? '' : s);
                        setCurrentPage(1);
                      }}
                      className={`h-9 flex items-center justify-center text-xs font-outfit tracking-wider uppercase border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-primaryGold bg-primaryGold/10 text-primaryGold font-bold'
                          : 'border-border-light bg-white text-charcoal hover:border-ink hover:text-ink'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {(categorySlug || minPrice > 0 || maxPrice < 2000000 || search || onlySale || color || size || sortBy !== 'newest') && (
            <Button
              onClick={clearAllFilters}
              className="w-full text-center border border-charcoal text-charcoal hover:border-ink hover:text-ink py-2.5 text-[10px] font-bold uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer h-auto bg-transparent"
            >
              {t('catalog.filter.clearAll', 'XÓA TẤT CẢ BỘ LỌC')}
            </Button>
          )}
        </aside>

        {/* Content Area Column */}
        <section className="flex-grow space-y-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between pb-4 border-b border-borderGray text-xs font-outfit select-none">
            <h2 className="font-playfair text-lg font-bold tracking-wider text-ink uppercase">
              {categorySlug
                ? categorySlug.replace(/-/g, ' ')
                : t('catalog.toolbar.allProducts', 'TẤT CẢ SẢN PHẨM')}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-charcoal">{t('catalog.toolbar.sortBy', 'Sắp xếp:')}</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-ink font-semibold tracking-wider uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest">{t('catalog.sort.newest', 'Mới Nhất')}</option>
                <option value="price_asc">{t('catalog.sort.priceAsc', 'Giá Tăng Dần')}</option>
                <option value="price_desc">{t('catalog.sort.priceDesc', 'Giá Giảm Dần')}</option>
              </select>
            </div>
          </div>

          {/* Products Grid State Rendering */}
          {isProductsLoading ? (
            /* Loading State Skeletons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-bgLight border border-borderGray p-4 flex flex-col justify-between rounded-none">
                  <div>
                    <div className="w-full aspect-[3/4] bg-zinc-100 mb-4 animate-pulse"></div>
                    <div className="h-3 w-16 bg-zinc-200 animate-pulse mb-2"></div>
                    <div className="h-4 w-full bg-zinc-200 animate-pulse"></div>
                  </div>
                  <div className="mt-6 pt-2 border-t border-zinc-100">
                    <div className="h-4 w-20 bg-zinc-200 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Error State */
            <div className="py-16 text-center space-y-4 border border-red-200 bg-red-50 select-none rounded-none">
              <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-red-800">
                {t('catalog.state.errorTitle', 'Không thể tải danh sách sản phẩm')}
              </h4>
              <Button
                onClick={() => refetch()}
                className="bg-red-800 hover:bg-red-900 border-none text-white text-xs font-semibold px-6 py-2.5 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer h-auto"
              >
                {t('catalog.state.retry', 'Thử Lại')}
              </Button>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="py-24 text-center space-y-4 border border-borderGray bg-bg-neutral select-none rounded-none">
              <h4 className="font-playfair text-xl font-bold uppercase tracking-wider text-ink">
                {t('catalog.state.emptyTitle', 'Không tìm thấy sản phẩm phù hợp')}
              </h4>
              <p className="text-xs text-charcoal max-w-xs mx-auto">
                {t('catalog.state.emptySubtitle', 'Thử điều chỉnh lại bộ lọc giá hoặc danh mục đã chọn.')}
              </p>
              <Button
                onClick={clearAllFilters}
                className="bg-ink hover:bg-primaryGold border-none text-bgLight text-xs font-semibold px-6 py-3 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer h-auto"
              >
                {t('catalog.state.clearFilters', 'Xóa Bộ Lọc')}
              </Button>
            </div>
          ) : (
            /* Success Grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-bgLight border border-borderGray p-4 flex flex-col justify-between group hover:shadow-[0_4px_24px_rgba(28,27,26,0.03)] hover:border-primaryGold transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <div>
                      <div className="w-full aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden relative">
                        <Image
                          src={getImageUrl(product.primaryImage, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80')}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[10px] text-charcoal font-semibold uppercase tracking-wider font-outfit">
                        {product.category.name}
                      </span>
                      <h4 className="font-outfit text-sm font-medium text-ink mt-1 line-clamp-1">{product.name}</h4>
                    </div>
                    <div className="mt-4 pt-2 border-t border-zinc-100 flex items-baseline justify-between">
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
                ))}
              </div>

              {/* Pagination footer */}
              {meta && meta.totalPages > 1 && (
                <div className="border-t border-borderGray pt-6 flex items-center justify-between text-xs font-outfit select-none">
                  <span className="text-charcoal">
                    {t('catalog.pagination.showInfo', {
                      count: products.length,
                      total: meta.totalItems,
                      defaultValue: `Hiển thị ${products.length} trên tổng số ${meta.totalItems} sản phẩm`,
                    })}
                  </span>
                  <Pagination
                    current={currentPage}
                    pageSize={8}
                    total={meta.totalItems}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    className="font-mono text-xs"
                  />
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
