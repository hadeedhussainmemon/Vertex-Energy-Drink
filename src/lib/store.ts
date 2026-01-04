import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface AppState {
    // Cart State
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    toggleCart: () => void;

    // UI State
    activeFlavorColor: string;
    setFlavorColor: (color: string) => void;

    // User State
    userInfo: { name: string; email: string; isAdmin: boolean; token: string } | null;
    login: (userData: any) => void;
    logout: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            isCartOpen: false,
            activeFlavorColor: '#00f0ff', // Default Neon Blue
            userInfo: null,

            addToCart: (item) => set((state) => {
                const existing = state.cart.find((i) => i.id === item.id);
                if (existing) {
                    return {
                        cart: state.cart.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        )
                    };
                }
                return { cart: [...state.cart, { ...item, quantity: 1 }] };
            }),

            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((i) => i.id !== id)
            })),

            clearCart: () => set({ cart: [] }),

            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

            setFlavorColor: (color) => set({ activeFlavorColor: color }),

            login: (userData) => {
                set({ userInfo: userData });
            },

            logout: () => {
                set({ userInfo: null });
            }
        }),
        {
            name: 'vertex-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cart: state.cart, userInfo: state.userInfo }),
        }
    )
);
