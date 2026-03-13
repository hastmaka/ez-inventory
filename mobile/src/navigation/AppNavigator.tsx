import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ScanScreen from '../screens/ScanScreen';
import CameraScreen from '../screens/CameraScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
  AddProduct: { productId?: number } | undefined;
  Scan: undefined;
  Camera: { sessionId: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
};

// Keep this alias so existing imports don't break
export type AppStackParamList = ProductStackParamList;

type TabParamList = {
  ProductsTab: undefined;
  SettingsTab: undefined;
};

const ProductStack = createNativeStackNavigator<ProductStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const STACK_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#1a1b1e' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: '#1a1b1e' },
};

function ProductStackNavigator() {
  return (
    <ProductStack.Navigator screenOptions={STACK_SCREEN_OPTIONS}>
      <ProductStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ headerShown: false }}
      />
      <ProductStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Detail' }}
      />
      <ProductStack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: '' }}
      />
      <ProductStack.Screen
        name="Scan"
        component={ScanScreen}
        options={{ headerShown: false }}
      />
      <ProductStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </ProductStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={STACK_SCREEN_OPTIONS}>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#141517',
          borderTopColor: '#25262b',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#228be6',
        tabBarInactiveTintColor: '#868e96',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductStackNavigator}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
