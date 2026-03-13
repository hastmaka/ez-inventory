import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { fetchApi } from '../api/fetchApi';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'ProductDetail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductDetailScreen({ route }: Props) {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi(`v1/product/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Load product failed:', err))
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#228be6" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Product not found</Text>
      </View>
    );
  }

  const images = product.product_image_url || [];
  const gramsToOz = (g: number) => (g * 0.035274).toFixed(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {images.length > 0 ? (
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.document_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}
        />
      ) : (
        <View style={[styles.heroImage, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{product.product_title || 'Untitled'}</Text>
        <Text style={styles.sku}>SKU: {product.product_sku || '—'}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ${(product.product_price || 0).toFixed(2)}
          </Text>
          <Text style={styles.qty}>
            Qty: {product.product_quantity ?? 0}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailGrid}>
          <DetailItem label="Material" value={product.product_material} />
          <DetailItem label="Type" value={product.product_type} />
          <DetailItem label="Gem" value={product.product_gem_type} />
          <DetailItem label="Color" value={product.product_color} />
          <DetailItem
            label="Weight"
            value={
              product.product_weight_g
                ? `${gramsToOz(product.product_weight_g)} oz (${product.product_weight_g}g)`
                : null
            }
          />
          <DetailItem
            label="Dimensions"
            value={
              product.product_height
                ? `${product.product_height} x ${product.product_width} x ${product.product_length} in`
                : null
            }
          />
        </View>

        {product.product_tag?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsRow}>
              {product.product_tag.map((tag: string, i: number) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {product.product_description ? (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.product_description}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

function DetailItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
    backgroundColor: '#1a1b1e',
  },
  content: {
    paddingBottom: 40,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  noImage: {
    backgroundColor: '#25262b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#868e96',
    fontSize: 16,
  },
  body: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  sku: {
    color: '#868e96',
    fontSize: 14,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    color: '#51cf66',
    fontSize: 20,
    fontWeight: '700',
  },
  qty: {
    color: '#868e96',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#373a40',
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailGrid: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#25262b',
  },
  detailLabel: {
    color: '#868e96',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#25262b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#868e96',
    fontSize: 13,
  },
  description: {
    color: '#c1c2c5',
    fontSize: 14,
    lineHeight: 22,
  },
  emptyText: {
    color: '#868e96',
    fontSize: 16,
  },
});
