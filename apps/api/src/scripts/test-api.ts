import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  response?: any;
}

class APITester {
  private authToken: string | null = null;

  private userId: string | null = null;

  private testResults: TestResult[] = [];

  private loggerTag = '[APITester]';

  private log(message: string) {
    // Reference this.loggerTag to satisfy the linter
    console.log(`${this.loggerTag} [${new Date().toISOString()}] ${message}`);
  }

  private async makeRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    headers?: any
  ) {
    try {
      const axiosConfig = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
          ...headers,
        },
        ...(data && { data }),
      };

      const response = await axios(axiosConfig);
      return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }

  private addResult(
    name: string,
    success: boolean,
    error?: string,
    response?: any
  ) {
    this.testResults.push({ name, success, error, response });
    const status = success ? '✅ PASS' : '❌ FAIL';
    this.log(`${status}: ${name}`);
    if (error) {
      // Print error as JSON if it's an object
      if (typeof error === 'object') {
        this.log(`   Error: ${JSON.stringify(error)}`);
      } else {
        this.log(`   Error: ${error}`);
      }
    }
  }

  async testHealthCheck() {
    this.log('Testing Health Check...');
    const result = await this.makeRequest('GET', '/health');

    if (result.success && result.data?.data?.status === 'healthy') {
      this.addResult('Health Check', true);
    } else {
      this.addResult('Health Check', false, result.error);
    }
  }

  async testAuthentication() {
    this.log('Testing Authentication...');

    // Test signup
    const signupData = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
    };

    const signupResult = await this.makeRequest(
      'POST',
      '/auth/signup',
      signupData
    );

    if (signupResult.success && signupResult.data?.success) {
      this.addResult('User Signup', true);

      // Test login
      const loginData = {
        email: signupData.email,
        password: signupData.password,
      };

      const loginResult = await this.makeRequest(
        'POST',
        '/auth/login',
        loginData
      );

      if (loginResult.success && loginResult.data?.data?.tokens?.accessToken) {
        this.authToken = loginResult.data.data.tokens.accessToken;
        this.userId = loginResult.data.data.user.id;
        this.addResult('User Login', true);
      } else {
        this.addResult('User Login', false, loginResult.error);
      }
    } else {
      this.addResult('User Signup', false, signupResult.error);
    }
  }

  async testProducts() {
    this.log('Testing Products...');

    // Test get products
    const productsResult = await this.makeRequest('GET', '/products');

    if (productsResult.success && productsResult.data?.success) {
      this.addResult('Get Products', true);

      // Test get deals and featured products
      const dealsFeaturedResult = await this.makeRequest(
        'GET',
        '/products/deals/featured'
      );
      if (
        dealsFeaturedResult.success &&
        Array.isArray(dealsFeaturedResult.data?.data?.deals) &&
        dealsFeaturedResult.data.data.deals.length > 0
      ) {
        this.addResult('Get Deals', true);
      } else {
        this.addResult('Get Deals', false, dealsFeaturedResult.error);
      }
      if (
        dealsFeaturedResult.success &&
        Array.isArray(dealsFeaturedResult.data?.data?.featured) &&
        dealsFeaturedResult.data.data.featured.length > 0
      ) {
        this.addResult('Get Featured Products', true);
      } else {
        this.addResult(
          'Get Featured Products',
          false,
          dealsFeaturedResult.error
        );
      }

      // Test get categories
      const categoriesResult = await this.makeRequest(
        'GET',
        '/products/categories'
      );
      if (categoriesResult.success && categoriesResult.data?.success) {
        this.addResult('Get Categories', true);
      } else {
        this.addResult('Get Categories', false, categoriesResult.error);
      }

      // Test get tags
      const tagsResult = await this.makeRequest('GET', '/products/tags');
      if (tagsResult.success && tagsResult.data?.success) {
        this.addResult('Get Tags', true);
      } else {
        this.addResult('Get Tags', false, tagsResult.error);
      }
    } else {
      this.addResult('Get Products', false, productsResult.error);
    }
  }

  async testAddresses() {
    if (!this.authToken) {
      this.addResult('Address Management', false, 'No auth token available');
      return;
    }

    this.log('Testing Address Management...');

    // Test create address
    const addressData = {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1234567890',
      isDefault: true,
      type: 'home', // Added to fix validation error
    };

    const createResult = await this.makeRequest(
      'POST',
      '/addresses',
      addressData
    );

    if (createResult.success && createResult.data?.success) {
      this.addResult('Create Address', true);
      const addressId = createResult.data.data.address.id;

      // Test get addresses
      const getAddressesResult = await this.makeRequest('GET', '/addresses');
      if (getAddressesResult.success && getAddressesResult.data?.success) {
        this.addResult('Get Addresses', true);
      } else {
        this.addResult('Get Addresses', false, getAddressesResult.error);
      }

      // Test get address by ID
      const getAddressResult = await this.makeRequest(
        'GET',
        `/addresses/${addressId}`
      );
      if (getAddressResult.success && getAddressResult.data?.success) {
        this.addResult('Get Address by ID', true);
      } else {
        this.addResult('Get Address by ID', false, getAddressResult.error);
      }

      // Test update address
      const updateData = { firstName: 'Jane' };
      const updateResult = await this.makeRequest(
        'PUT',
        `/addresses/${addressId}`,
        updateData
      );
      if (updateResult.success && updateResult.data?.success) {
        this.addResult('Update Address', true);
      } else {
        this.addResult('Update Address', false, updateResult.error);
      }

      // Test delete address
      const deleteResult = await this.makeRequest(
        'DELETE',
        `/addresses/${addressId}`
      );
      if (deleteResult.success && deleteResult.data?.success) {
        this.addResult('Delete Address', true);
      } else {
        this.addResult('Delete Address', false, deleteResult.error);
      }
    } else {
      this.addResult('Create Address', false, createResult.error);
    }
  }

  async testCart() {
    if (!this.authToken) {
      this.addResult('Cart Management', false, 'No auth token available');
      return;
    }

    this.log('Testing Cart Management...');

    // Test get cart (should be empty initially)
    const getCartResult = await this.makeRequest('GET', '/cart');
    if (getCartResult.success && getCartResult.data?.success) {
      this.addResult('Get Cart', true);
    } else {
      this.addResult('Get Cart', false, getCartResult.error);
    }

    // Note: Cart operations require products to exist in the database
    // This is a basic test that the endpoint responds correctly
  }

  async testWishlist() {
    if (!this.authToken) {
      this.addResult('Wishlist Management', false, 'No auth token available');
      return;
    }

    this.log('Testing Wishlist Management...');

    // Test get wishlist (should be empty initially)
    const getWishlistResult = await this.makeRequest('GET', '/wishlist');
    if (getWishlistResult.success && getWishlistResult.data?.success) {
      this.addResult('Get Wishlist', true);
    } else {
      this.addResult('Get Wishlist', false, getWishlistResult.error);
    }

    // Note: Wishlist operations require products to exist in the database
    // This is a basic test that the endpoint responds correctly
  }

  async testOrders() {
    if (!this.authToken) {
      this.addResult('Order Management', false, 'No auth token available');
      return;
    }

    this.log('Testing Order Management...');

    // Test get orders (should be empty initially)
    const getOrdersResult = await this.makeRequest('GET', '/orders');
    if (getOrdersResult.success && getOrdersResult.data?.success) {
      this.addResult('Get Orders', true);
    } else {
      this.addResult('Get Orders', false, getOrdersResult.error);
    }

    // Note: Order creation requires products, cart items, and addresses
    // This is a basic test that the endpoint responds correctly
  }

  async testWebhooks() {
    this.log('Testing Webhooks...');

    // Test webhook endpoint (should return 400 without proper signature)
    const webhookResult = await this.makeRequest(
      'POST',
      '/webhooks/stripe',
      {}
    );
    if (webhookResult.status === 400) {
      this.addResult('Webhook Endpoint (Invalid Signature)', true);
    } else {
      this.addResult(
        'Webhook Endpoint',
        false,
        'Expected 400 status for invalid signature'
      );
    }
  }

  async runAllTests() {
    this.log('🚀 Starting API Tests...');
    this.log(`API Base URL: ${API_BASE_URL}`);
    this.log('');

    try {
      await this.testHealthCheck();
      await this.testAuthentication();
      await this.testProducts();
      await this.testAddresses();
      await this.testCart();
      await this.testWishlist();
      await this.testOrders();
      await this.testWebhooks();

      this.log('');
      this.log('📊 Test Results Summary:');
      this.log('========================');

      const passed = this.testResults.filter(r => r.success).length;
      const failed = this.testResults.filter(r => !r.success).length;
      const total = this.testResults.length;

      this.log(`Total Tests: ${total}`);
      this.log(`Passed: ${passed}`);
      this.log(`Failed: ${failed}`);
      this.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

      if (failed > 0) {
        this.log('');
        this.log('❌ Failed Tests:');
        this.testResults
          .filter(r => !r.success)
          .forEach(r => {
            this.log(`  - ${r.name}: ${r.error}`);
          });
      }

      this.log('');
      if (failed === 0) {
        this.log('🎉 All tests passed! API is working correctly.');
      } else {
        this.log('⚠️  Some tests failed. Please check the errors above.');
      }
    } catch (error) {
      this.log(`💥 Test runner error: ${error}`);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch(console.error);
}

export default APITester;
