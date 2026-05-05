// Zoho CRM OAuth Token Management Service
// Handles automatic token refresh and caching

interface TokenData {
  access_token: string
  expires_at: number // Timestamp when token expires
  obtained_at: number // Timestamp when token was obtained
}

interface RefreshTokenResponse {
  access_token: string
  expires_in: number
  api_domain: string
  token_type: string
  error?: string
  error_description?: string
  message?: string
}

class ZohoTokenManager {
  private static instance: ZohoTokenManager
  private tokenData: TokenData | null = null
  private clientId: string | null = null
  private clientSecret: string | null = null
  private refreshToken: string | null = null
  private readonly accountsBaseUrl: string
  private readonly tokenBufferMs: number = 5 * 60 * 1000 // 5 minutes buffer before expiry
  private initialized: boolean = false

  constructor() {
    this.accountsBaseUrl = process.env.ZOHO_ACCOUNTS_BASE_URL || 'https://accounts.zoho.in'
  }

  private initialize(): void {
    if (this.initialized) return

    this.clientId = process.env.ZOHO_CLIENT_ID || null
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET || null
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN || null

    // Validate required credentials
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      console.warn('⚠️ Zoho OAuth credentials are missing. Zoho CRM integration will be disabled.')
      console.log('📋 To enable Zoho CRM, set these environment variables:')
      console.log('   - ZOHO_CLIENT_ID')
      console.log('   - ZOHO_CLIENT_SECRET')
      console.log('   - ZOHO_REFRESH_TOKEN')
      this.initialized = true
      return
    }

    console.log('🔐 Zoho Token Manager initialized')
    console.log(`📝 Client ID: ${this.clientId.substring(0, 10)}...`)
    console.log(`🔄 Refresh Token: ${this.refreshToken.substring(0, 20)}...`)
    this.initialized = true
  }

  public static getInstance(): ZohoTokenManager {
    if (!ZohoTokenManager.instance) {
      ZohoTokenManager.instance = new ZohoTokenManager()
    }
    return ZohoTokenManager.instance
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  public async getAccessToken(): Promise<string> {
    this.initialize()
    
    // Check if credentials are available
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      throw new Error('Zoho OAuth credentials are not configured. Please check your environment variables.')
    }

    const now = Date.now()

    // Check if we have a valid token
    if (this.tokenData && this.tokenData.expires_at > now) {
      const timeUntilExpiry = this.tokenData.expires_at - now
      console.log(`✅ Using cached access token (expires in ${Math.round(timeUntilExpiry / 1000)}s)`)
      return this.tokenData.access_token
    }

    // Token is expired or doesn't exist, refresh it
    console.log('🔄 Access token expired or missing, refreshing...')
    return await this.refreshAccessToken()
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      throw new Error('Zoho OAuth credentials are not configured.')
    }

    try {
      console.log('📤 Requesting new access token from Zoho OAuth...')

      const tokenUrl = `${this.accountsBaseUrl}/oauth/v2/token`
      const params = new URLSearchParams({
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token'
      })

      const response = await fetch(`${tokenUrl}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      })

      console.log(`📨 Token response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Token refresh failed:', errorText)
        throw new Error(`Zoho token refresh failed: ${response.status} ${errorText}`)
      }

      const tokenResponse = await response.json() as RefreshTokenResponse
      console.log('📦 Token response received:', JSON.stringify(tokenResponse, null, 2))

      if (tokenResponse.error) {
        const details = tokenResponse.error_description || tokenResponse.message || tokenResponse.error
        throw new Error(`Zoho token refresh error: ${tokenResponse.error} - ${details}`)
      }

      // Validate response
      if (!tokenResponse.access_token) {
        console.error('❌ Missing access_token in response:', {
          response: JSON.stringify(tokenResponse),
          status: response.status,
          keys: Object.keys(tokenResponse)
        })
        throw new Error(`Zoho token response did not include access_token. Response keys: ${Object.keys(tokenResponse).join(', ')}`)
      }

      if (!tokenResponse.expires_in) {
        console.warn('⚠️ No expires_in provided, using default 1 hour')
        tokenResponse.expires_in = 3600 // Default to 1 hour
      }

      // Store new token with expiry time (subtract buffer for safety)
      const now = Date.now()
      const expiresAt = now + (tokenResponse.expires_in * 1000) - this.tokenBufferMs

      this.tokenData = {
        access_token: tokenResponse.access_token,
        expires_at: expiresAt,
        obtained_at: now
      }

      console.log('✅ Access token refreshed successfully!')
      console.log(`🔑 New token expires at: ${new Date(expiresAt).toLocaleString()}`)
      console.log(`⏰ Valid for: ${Math.round((expiresAt - now) / 1000)} seconds`)
      console.log(`🌐 API Domain: ${tokenResponse.api_domain}`)
      console.log(`🏷️ Token Type: ${tokenResponse.token_type}`)

      return this.tokenData.access_token

    } catch (error) {
      console.error('💥 Token refresh error:', error)
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('📋 Error details:', {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          clientId: this.clientId.substring(0, 10) + '...',
          refreshTokenValid: !!this.refreshToken
        })
      }

      // Clear invalid token data
      this.tokenData = null
      
      throw error
    }
  }

  /**
   * Force token refresh (useful for testing or when you suspect token is invalid)
   */
  public async forceRefreshToken(): Promise<string> {
    console.log('🔄 Forcing token refresh...')
    this.tokenData = null // Clear cached token
    return await this.refreshAccessToken()
  }

  /**
   * Get token status information
   */
  public getTokenStatus(): {
    hasToken: boolean
    isValid: boolean
    expiresAt?: Date
    timeUntilExpiry?: number
    obtainedAt?: Date
    isConfigured: boolean
  } {
    this.initialize()
    
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      return {
        hasToken: false,
        isValid: false,
        isConfigured: false
      }
    }

    if (!this.tokenData) {
      return {
        hasToken: false,
        isValid: false,
        isConfigured: true
      }
    }

    const now = Date.now()
    const isValid = this.tokenData.expires_at > now

    return {
      hasToken: true,
      isValid,
      expiresAt: new Date(this.tokenData.expires_at),
      timeUntilExpiry: isValid ? Math.round((this.tokenData.expires_at - now) / 1000) : 0,
      obtainedAt: new Date(this.tokenData.obtained_at),
      isConfigured: true
    }
  }

  /**
   * Clear stored token (useful for logout or testing)
   */
  public clearToken(): void {
    console.log('🗑️ Clearing stored access token...')
    this.tokenData = null
  }

  /**
   * Test token validity by making a simple API call
   */
  public async testTokenValidity(): Promise<boolean> {
    try {
      const token = await this.getAccessToken()
      console.log('🧪 Testing token validity...')
      
      // Make a simple API call to test the token
      const apiBaseUrl = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.in'
      const response = await fetch(`${apiBaseUrl}/crm/v2/users?type=CurrentUser`, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        console.log('✅ Token is valid and working')
        return true
      } else {
        console.warn(`⚠️ Token test failed with status: ${response.status}`)
        // Force refresh on next call
        this.tokenData = null
        return false
      }
    } catch (error) {
      console.error('❌ Token test error:', error)
      this.tokenData = null
      return false
    }
  }
}

// Export singleton instance
export const zohoTokenManager = ZohoTokenManager.getInstance()

// Export class for testing or multiple instances
export { ZohoTokenManager }

// Export types
export type { TokenData, RefreshTokenResponse }
