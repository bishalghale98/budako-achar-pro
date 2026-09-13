import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/auth-api";
import { productApi } from "@/features/products/product-api";
import { categoryApi } from "@/features/products/category-api";
import { adminApi } from "@/features/admin/admin-api";
import { cartApi } from "@/features/cart/cart-api";
import { orderApi } from "@/features/order/order-api";
import { customerApi } from "@/features/customer/customer-api";
import { addressApi } from "@/features/address/address-api";
import { settingsApi } from "@/features/settings/settings-api";
import authReducer from "@/features/auth/auth-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      [cartApi.reducerPath]: cartApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [customerApi.reducerPath]: customerApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(productApi.middleware)
        .concat(categoryApi.middleware)
        .concat(adminApi.middleware)
        .concat(cartApi.middleware)
        .concat(orderApi.middleware)
        .concat(customerApi.middleware)
        .concat(addressApi.middleware)
        .concat(settingsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
