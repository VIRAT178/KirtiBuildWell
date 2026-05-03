import { zohoTokenManager } from './zohoTokenManager'

type LeadPayload = {
  name: string
  email: string
  phone: string
  message: string
}

type ZohoCreateLeadResponse = {
  data?: Array<{ status: string; code: string; message: string; details?: Record<string, unknown> }>
}

type ZohoTokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  api_domain: string
  token_type: string
}

export async function exchangeZohoAuthorizationCode(code: string, redirectUri: string): Promise<ZohoTokenResponse> {
  const clientId = process.env.ZOHO_CLIENT_ID
  const clientSecret = process.env.ZOHO_CLIENT_SECRET
  const accountsBaseUrl = process.env.ZOHO_ACCOUNTS_BASE_URL || 'https://accounts.zoho.in'

  if (!clientId || !clientSecret) {
    throw new Error('Zoho OAuth credentials are missing')
  }

  if (!code) {
    throw new Error('Authorization code is required')
  }

  if (!redirectUri) {
    throw new Error('Redirect URI is required')
  }

  console.log('🔄 Exchanging authorization code for tokens...')
  console.log(`📝 Client ID: ${clientId.substring(0, 10)}...`)
  console.log(`🔗 Redirect URI: ${redirectUri}`)
  console.log(`🎫 Authorization Code: ${code.substring(0, 20)}...`)

  const tokenUrl = `${accountsBaseUrl}/oauth/v2/token`
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code: code
  })

  try {
    console.log('📤 Sending token request to:', tokenUrl)
    
    const tokenResponse = await fetch(`${tokenUrl}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    })

    console.log(`📨 Token response status: ${tokenResponse.status}`)

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token request failed:', errorText)
      throw new Error(`Zoho token request failed: ${tokenResponse.status} ${errorText}`)
    }

    const tokenData = await tokenResponse.json() as ZohoTokenResponse
    
    console.log('✅ Token exchange successful!')
    console.log(`🔑 Access Token: ${tokenData.access_token ? tokenData.access_token.substring(0, 20) + '...' : 'Not received'}`)
    console.log(`🔄 Refresh Token: ${tokenData.refresh_token ? tokenData.refresh_token.substring(0, 20) + '...' : 'Not received'}`)
    console.log(`⏰ Expires in: ${tokenData.expires_in} seconds`)
    console.log(`🌐 API Domain: ${tokenData.api_domain}`)
    console.log(`🏷️ Token Type: ${tokenData.token_type}`)

    // Validate required fields
    if (!tokenData.access_token) {
      throw new Error('Zoho token response did not include access_token')
    }

    if (!tokenData.refresh_token) {
      console.warn('⚠️ No refresh token received - this may be expected if already granted')
    }

    return tokenData
  } catch (error) {
    console.error('💥 Token exchange error:', error)
    
    if (error instanceof Error) {
      // Log detailed error information
      console.error('📋 Error details:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        clientId: clientId.substring(0, 10) + '...',
        redirectUri,
        codeProvided: !!code
      })
    }
    
    throw error
  }
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] }
  }

  const lastName = parts[parts.length - 1]
  const firstName = parts.slice(0, -1).join(' ')
  return { firstName, lastName }
}

export async function pushLeadToZoho(lead: LeadPayload): Promise<void> {
  const apiBaseUrl = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.in'
  
  // Check if Zoho is configured
  const tokenStatus = zohoTokenManager.getTokenStatus()
  if (!tokenStatus.isConfigured) {
    console.warn('⚠️ Zoho CRM is not configured. Skipping CRM sync.')
    return // Silently skip CRM sync if not configured
  }
  
  // Get access token using the token manager (handles automatic refresh)
  const accessToken = await zohoTokenManager.getAccessToken()
  
  const { firstName, lastName } = splitName(lead.name)

  const body = {
    data: [
      {
        First_Name: firstName,
        Last_Name: lastName,
        Email: lead.email,
        Phone: lead.phone,
        Description: lead.message,
        Lead_Source: 'Website',
        Company: 'KirtiBuildWell'
      }
    ],
    trigger: ['workflow']
  }

  console.log('📤 Pushing lead to Zoho CRM...')
  console.log(`👤 Lead: ${lead.name} (${lead.email})`)
  console.log(`🔗 API URL: ${apiBaseUrl}/crm/v2/Leads`)

  try {
    const response = await fetch(`${apiBaseUrl}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    console.log(`📨 CRM response status: ${response.status}`)

    const data = (await response.json()) as ZohoCreateLeadResponse
    if (!response.ok) {
      console.error('❌ CRM API request failed:', JSON.stringify(data))
      throw new Error(`Zoho CRM request failed: ${response.status} ${JSON.stringify(data)}`)
    }

    const item = data.data?.[0]
    if (!item || item.status !== 'success') {
      console.error('❌ Lead creation failed:', JSON.stringify(data))
      throw new Error(`Zoho CRM lead creation failed: ${JSON.stringify(data)}`)
    }

    console.log('✅ Lead successfully pushed to Zoho CRM!')
    console.log(`📋 Lead ID: ${item.code}`)
    console.log(`📝 Message: ${item.message}`)
  } catch (error) {
    console.error('💥 Zoho CRM push error:', error)
    
    // If it's a token error, clear the token to force refresh on next call
    if (error instanceof Error && (error.message.includes('401') || error.message.includes('token'))) {
      console.log('🔄 Token error detected, clearing cached token...')
      zohoTokenManager.clearToken()
    }
    
    throw error
  }
}
