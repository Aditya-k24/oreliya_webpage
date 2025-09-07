import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../api/client';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variantId?: string;
  variantSize?: string;
  variantMaterial?: string;
  customizations?: Array<{
    name: string;
    value: string;
    priceAdjustment: number;
  }>;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TOTALS' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CART':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'UPDATE_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: updatedItems };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'UPDATE_TOTALS': {
      const itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const total = state.items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        const customizationTotal = (item.customizations || []).reduce(
          (customSum, custom) =>
            customSum + custom.priceAdjustment * item.quantity,
          0
        );
        return sum + itemTotal + customizationTotal;
      }, 0);
      return { ...state, total, itemCount };
    }

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await apiClient.get('/cart');
      if (response.data.success) {
        dispatch({ type: 'SET_CART', payload: response.data.data.items || [] });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  // Update totals whenever items change (with deep comparison)
  const itemsString = useMemo(() => JSON.stringify(state.items), [state.items]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_TOTALS' });
  }, [itemsString]);

  // Load cart from API when user is authenticated
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // For non-logged-in users, show empty cart
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user, refreshCart]);

  const addToCart = useCallback(
    async (item: Omit<CartItem, 'id'>) => {
      if (!user) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Please login to add items to cart',
        });
        return;
      }

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const response = await apiClient.post('/cart/items', {
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId,
          customizations: item.customizations,
        });

        if (response.data.success) {
          await refreshCart();
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to add item to cart';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [user, refreshCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!user) return;

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const response = await apiClient.put(`/cart/items/${itemId}`, {
          quantity,
        });

        if (response.data.success) {
          await refreshCart();
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update quantity';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [user, refreshCart]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!user) return;

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const response = await apiClient.delete(`/cart/items/${itemId}`);

        if (response.data.success) {
          await refreshCart();
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove item';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [user, refreshCart]
  );

  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await apiClient.delete('/cart');

      if (response.data.success) {
        await refreshCart();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, refreshCart]);

  const value: CartContextType = useMemo(
    () => ({
      state,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    }),
    [state, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
