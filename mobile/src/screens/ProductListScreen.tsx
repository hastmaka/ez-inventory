import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchApi } from '../api/fetchApi';
import { SearchInput } from '../components/SearchInput';

import type { SearchInputHandle } from '../components/SearchInput';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProductStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<ProductStackParamList, 'ProductList'>;

interface Product {
  product_id: number;
  product_title: string;
  product_sku: string;
  product_price: number;
  product_material: string;
  product_quantity: number;
  product_image_url: Array<{
    document_url: string;
    document_primary: boolean;
  }>;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function ProductListScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [isSizePickerOpen, setIsSizePickerOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const searchRef = useRef<SearchInputHandle>(null);
  const activeSearchTerm = useRef('');

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const loadProducts = useCallback(async (
    pageIndex: number,
    limit: number,
    searchTerm?: string,
  ) => {
    try {
      const term = searchTerm ?? activeSearchTerm.current;
      const query: Record<string, unknown> = {
        limit,
        offset: pageIndex * limit,
      };
      if (term) {
        query.filters = JSON.stringify([
          { id: 'product_title', value: term },
        ]);
      }
      const response = await fetchApi('v1/product', 'GET', null, query);
      if (response?.data) {
        const list: Product[] = response.data.list || response.data;
        const count = response.data.total ?? list.length;
        setProducts(list);
        setTotal(count);
        setPage(pageIndex);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts(0, pageSize).then(() => setIsLoading(false));
    }, [loadProducts, pageSize]),
  );

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadProducts(0, pageSize);
    setIsRefreshing(false);
  }

  function handleSearch(value: string) {
    activeSearchTerm.current = value;
    setIsLoading(true);
    loadProducts(0, pageSize, value).then(() => setIsLoading(false));
  }

  function handleSearchClear() {
    activeSearchTerm.current = '';
    setIsLoading(true);
    loadProducts(0, pageSize, '').then(() => setIsLoading(false));
  }

  function goToPage(p: number) {
    if (p < 0 || p >= totalPages) return;
    setIsLoading(true);
    loadProducts(p, pageSize).then(() => setIsLoading(false));
  }

  function handlePageSizeChange(size: number) {
    setIsSizePickerOpen(false);
    setPageSize(size);
    setIsLoading(true);
    loadProducts(0, size).then(() => setIsLoading(false));
  }

  function getPrimaryImage(product: Product): string | null {
    const primary = product.product_image_url?.find((i) => i.document_primary);
    return primary?.document_url || product.product_image_url?.[0]?.document_url || null;
  }

  function formatMoney(amount: number): string {
    return `$${(amount || 0).toFixed(2)}`;
  }

  function renderProduct({ item }: { item: Product }) {
    const imageUrl = getPrimaryImage(item);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', {
          productId: item.product_id,
        })}
        activeOpacity={0.7}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.noImage]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.product_title || 'Untitled'}
          </Text>
          <Text style={styles.cardSku}>{item.product_sku || '—'}</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardPrice}>{formatMoney(item.product_price)}</Text>
            <Text style={styles.cardQty}>Qty: {item.product_quantity ?? 0}</Text>
          </View>
          {item.product_material ? (
            <Text style={styles.cardMaterial}>{item.product_material}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddProduct', {
            productId: item.product_id,
          })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="pencil" size={18} color="#228be6" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search */}
      <SearchInput
        ref={searchRef}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      {/* List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#228be6" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.product_id)}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#228be6"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}

      {/* Pagination bar */}
      <View style={styles.paginationBar}>
        {/* Page size dropdown */}
        <TouchableOpacity
          style={styles.pageSizeBtn}
          onPress={() => setIsSizePickerOpen(true)}
        >
          <Text style={styles.pageSizeText}>{pageSize}</Text>
          <Ionicons name="chevron-down" size={14} color="#868e96" />
        </TouchableOpacity>

        {/* Nav controls */}
        <TouchableOpacity
          style={[styles.pageBtn, page === 0 && styles.pageBtnDisabled]}
          onPress={() => goToPage(page - 1)}
          disabled={page === 0}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={page === 0 ? '#555' : '#fff'}
          />
        </TouchableOpacity>

        <Text style={styles.pageText}>
          {page + 1} / {totalPages}
          <Text style={styles.pageTotal}>  ({total})</Text>
        </Text>

        <TouchableOpacity
          style={[styles.pageBtn, page >= totalPages - 1 && styles.pageBtnDisabled]}
          onPress={() => goToPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={page >= totalPages - 1 ? '#555' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Page size picker modal */}
      <Modal
        visible={isSizePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSizePickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSizePickerOpen(false)}
        >
          <View style={styles.pageSizeModal}>
            <Text style={styles.pageSizeModalTitle}>Items per page</Text>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.pageSizeOption,
                  size === pageSize && styles.pageSizeOptionActive,
                ]}
                onPress={() => handlePageSizeChange(size)}
              >
                <Text
                  style={[
                    styles.pageSizeOptionText,
                    size === pageSize && styles.pageSizeOptionTextActive,
                  ]}
                >
                  {size}
                </Text>
                {size === pageSize && (
                  <Ionicons name="checkmark" size={18} color="#228be6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#25262b',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImage: {
    width: 90,
    height: 90,
  },
  noImage: {
    backgroundColor: '#373a40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#868e96',
    fontSize: 11,
  },
  cardBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cardSku: {
    color: '#868e96',
    fontSize: 12,
    marginTop: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardPrice: {
    color: '#51cf66',
    fontSize: 14,
    fontWeight: '600',
  },
  cardQty: {
    color: '#868e96',
    fontSize: 13,
  },
  cardMaterial: {
    color: '#868e96',
    fontSize: 12,
    marginTop: 2,
  },
  editBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    backgroundColor: 'rgba(34,139,230,0.12)',
  },
  emptyText: {
    color: '#868e96',
    fontSize: 16,
  },
  // Pagination
  paginationBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#25262b',
    backgroundColor: '#1a1b1e',
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#25262b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 70,
    textAlign: 'center',
  },
  pageTotal: {
    color: '#868e96',
    fontWeight: '400',
  },
  pageSizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#25262b',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    borderWidth: 1,
    borderColor: '#373a40',
    marginRight: 'auto',
  },
  pageSizeText: {
    color: '#c1c2c5',
    fontSize: 14,
    fontWeight: '500',
  },
  // Page size modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageSizeModal: {
    backgroundColor: '#25262b',
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    borderWidth: 1,
    borderColor: '#373a40',
  },
  pageSizeModalTitle: {
    color: '#868e96',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageSizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pageSizeOptionActive: {
    backgroundColor: '#1c3a5c',
  },
  pageSizeOptionText: {
    color: '#c1c2c5',
    fontSize: 16,
  },
  pageSizeOptionTextActive: {
    color: '#228be6',
    fontWeight: '600',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#228be6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
  },
});
