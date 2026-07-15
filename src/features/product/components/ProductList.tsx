'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProductList } from '../hooks';
import { Category } from '@/types';
import { Input, Button } from '@/components/ui';
import { Checkbox, Pagination } from 'antd';
import { getImageUrl } from '@/lib/utils';

export default function ProductList() {
  const {
    t,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    categorySlug,
    priceRange,
    search,
    setSearch,
    categories,
    isCategoriesLoading,
    products,
    isProductsLoading,
    isError,
    refetch,
    meta,
    handleCategorySelect,
    handlePriceRangeSelect,
    clearAllFilters,
  } = useProductList();

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
          <span>{cat.name.toUpperCase()}</span>
          {isActive && <span className="text-[8px]">✦</span>}
        </div>
        {hasChildren && (
          <div className="pl-3 border-l border-borderGray ml-1 space-y-1">
            {cat.children!.map((child) => renderCategoryNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-bgLight min-h-screen text-ink pb-16">
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        
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
          <div className="space-y-2 pt-4 border-t border-borderGray">
            <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink">
              {t('catalog.filter.search', 'Tìm Kiếm')}
            </h3>
            <Input
              placeholder={t('catalog.filter.searchPlaceholder', 'Tìm sản phẩm...')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
              className="w-full rounded-none font-outfit text-xs"
            />
          </div>

          {/* Categories Hierarchical List */}
          <div className="space-y-4 pt-6 border-t border-borderGray">
            <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink">
              {t('catalog.filter.categories', 'Danh Mục')}
            </h3>
            {isCategoriesLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-28 bg-zinc-100 animate-pulse"></div>
                <div className="h-4 w-32 bg-zinc-100 animate-pulse pl-4"></div>
                <div className="h-4 w-24 bg-zinc-100 animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {categories && categories.length > 0 ? (
                  categories.map((cat) => renderCategoryNode(cat))
                ) : (
                  <p className="text-xs text-charcoal italic">{t('catalog.filter.noCategories', 'Không có danh mục')}</p>
                )}
              </div>
            )}
          </div>

          {/* Price Range Checkboxes */}
          <div className="space-y-4 pt-6 border-t border-borderGray">
            <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-ink">
              {t('catalog.filter.price', 'Khoảng Giá')}
            </h3>
            <div className="space-y-2.5 flex flex-col">
              <Checkbox
                checked={priceRange === 'under200'}
                onChange={() => handlePriceRangeSelect('under200')}
                className="text-xs font-outfit text-charcoal hover:text-ink select-none cursor-pointer"
              >
                {t('catalog.price.under200', 'Dưới 200.000 ₫')}
              </Checkbox>
              <Checkbox
                checked={priceRange === '200to500'}
                onChange={() => handlePriceRangeSelect('200to500')}
                className="text-xs font-outfit text-charcoal hover:text-ink select-none cursor-pointer"
              >
                {t('catalog.price.200to500', '200.000 ₫ - 500.000 ₫')}
              </Checkbox>
              <Checkbox
                checked={priceRange === 'over500'}
                onChange={() => handlePriceRangeSelect('over500')}
                className="text-xs font-outfit text-charcoal hover:text-ink select-none cursor-pointer"
              >
                {t('catalog.price.over500', 'Trên 500.000 ₫')}
              </Checkbox>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(categorySlug || priceRange || search || sortBy !== 'newest') && (
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
