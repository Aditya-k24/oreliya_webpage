import axios from 'axios';
import { config } from 'dotenv';

config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

async function adminLogin() {
  const loginData = {
    email: 'admin@oreliya.com',
    password: 'password123', // Use the seeded admin password
  };
  const res = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
  return res.data.data.tokens.accessToken;
}

async function testAdminEndpoints() {
  let token = '';
  try {
    token = await adminLogin();
    console.log('✅ Admin login successful');
  } catch (e: any) {
    console.error('❌ Admin login failed:', e.response?.data || e.message);
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };

  // 1. Stats
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/stats`, { headers });
    console.log('✅ Stats:', res.data.data);
  } catch (e: any) {
    console.error('❌ Stats:', e.response?.data || e.message);
  }

  // 2. Deals CRUD
  let dealId = '';
  try {
    // Create
    const createRes = await axios.post(
      `${API_BASE_URL}/admin/deals`,
      {
        name: 'Test Deal',
        description: '20% off',
        type: 'percentage',
        value: 20,
        minAmount: 50,
        maxDiscount: 200,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        isActive: true,
        usageLimit: 100,
      },
      { headers }
    );
    dealId = createRes.data.data.deal.id;
    console.log('✅ Deal created:', createRes.data.data.deal);
    // List
    const listRes = await axios.get(`${API_BASE_URL}/admin/deals`, { headers });
    console.log('✅ Deals listed:', listRes.data.data.deals.length);
    // Update
    const updateRes = await axios.put(
      `${API_BASE_URL}/admin/deals/${dealId}`,
      { description: '25% off', value: 25 },
      { headers }
    );
    console.log('✅ Deal updated:', updateRes.data.data.deal);
    // Delete
    await axios.delete(`${API_BASE_URL}/admin/deals/${dealId}`, { headers });
    console.log('✅ Deal deleted');
  } catch (e: any) {
    console.error('❌ Deal CRUD:', e.response?.data || e.message);
  }

  // 3. Customization Presets CRUD
  let customizationId = '';
  try {
    // Get an existing product ID first
    const productsRes = await axios.get(`${API_BASE_URL}/products`, {
      headers,
    });
    const productId = productsRes.data.data.products[0]?.id;

    if (!productId) {
      console.log('⚠️  No products found, skipping customization tests');
    } else {
      // Create
      const createRes = await axios.post(
        `${API_BASE_URL}/admin/customizations`,
        {
          name: 'Test Preset',
          type: 'select',
          required: false,
          options: ['A', 'B'],
          priceAdjustment: 10,
          productId,
        },
        { headers }
      );
      customizationId = createRes.data.data.customization.id;
      console.log(
        '✅ Customization created:',
        createRes.data.data.customization
      );
      // List
      const listRes = await axios.get(`${API_BASE_URL}/admin/customizations`, {
        headers,
      });
      console.log(
        '✅ Customizations listed:',
        listRes.data.data.customizations.length
      );
      // Update
      const updateRes = await axios.put(
        `${API_BASE_URL}/admin/customizations/${customizationId}`,
        { name: 'Updated Preset' },
        { headers }
      );
      console.log(
        '✅ Customization updated:',
        updateRes.data.data.customization
      );
      // Delete
      await axios.delete(
        `${API_BASE_URL}/admin/customizations/${customizationId}`,
        { headers }
      );
      console.log('✅ Customization deleted');
    }
  } catch (e: any) {
    console.error('❌ Customization CRUD:', e.response?.data || e.message);
  }

  // 4. Role Management CRUD
  let roleId = '';
  try {
    // Create with unique name
    const uniqueRoleName = `testrole_${Date.now()}`;
    const createRes = await axios.post(
      `${API_BASE_URL}/admin/roles`,
      { name: uniqueRoleName, description: 'Test Role' },
      { headers }
    );
    roleId = createRes.data.data.role.id;
    console.log('✅ Role created:', createRes.data.data.role);
    // List
    const listRes = await axios.get(`${API_BASE_URL}/admin/roles`, { headers });
    console.log('✅ Roles listed:', listRes.data.data.roles.length);
    // Update
    const updateRes = await axios.put(
      `${API_BASE_URL}/admin/roles/${roleId}`,
      { description: 'Updated Role' },
      { headers }
    );
    console.log('✅ Role updated:', updateRes.data.data.role);
    // Delete
    await axios.delete(`${API_BASE_URL}/admin/roles/${roleId}`, { headers });
    console.log('✅ Role deleted');
  } catch (e: any) {
    console.error('❌ Role CRUD:', e.response?.data || e.message);
  }
}

testAdminEndpoints();
