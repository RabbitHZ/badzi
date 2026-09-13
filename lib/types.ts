// Types mirrored from the backend OpenAPI spec
// (http://localhost:8080/v3/api-docs — "조회수 및 뱃지 관리 API v1.0.0").
// Responses are wrapped in ApiResponse<T>.

export interface ApiResponse<T> {
  success?: boolean
  code?: string
  message?: string
  data: T
}

export interface ShopItem {
  id: number
  name: string
  description: string
  priceKrw: number
}

export interface BadgeStyle {
  id: number
  name: string
  styleType: string
  color: string
  label: string
  icon: string
  fontSize: number
  preset: boolean
  shopItemId: number | null
}

export interface BadgeStyleRequest {
  name: string
  styleType: string
  color: string
  label: string
  icon: string
  fontSize: number
}

export interface Payment {
  id: number
  shopItemId: number
  orderNo: string
  amountKrw: number
  status: string
  paidAt: string | null
  createdAt: string
}

export interface CreatePaymentResponse {
  paymentId: number
  orderNo: string
  paymentUrl: string
}

export interface UserProfile {
  id: number
  provider: string
  username: string
  email: string
  name: string
}

export interface UserItem {
  id: number
  shopItem: ShopItem
  acquiredAt: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ViewCount {
  today: number
  total: number
}
