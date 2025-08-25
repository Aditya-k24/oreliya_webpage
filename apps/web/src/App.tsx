import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { DefaultLayout } from './components/DefaultLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ProductsPage } from './pages/Products';
import { CustomizationPage } from './pages/Deals';
import { AboutPage } from './pages/About';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Orders } from './pages/Orders';
import { Account } from './pages/Account';
import { Contact } from './pages/Contact';

// Placeholder components for other pages
function ProductDetails() {
  return (
    <div className='p-8 text-center'>Product Details Page - Coming Soon</div>
  );
}
function Admin() {
  return <div className='p-8 text-center'>Admin Page - Coming Soon</div>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />

              {/* Layout routes */}
              <Route
                path='/'
                element={
                  <DefaultLayout>
                    <Home />
                  </DefaultLayout>
                }
              />

              <Route
                path='/products'
                element={
                  <DefaultLayout>
                    <ProductsPage />
                  </DefaultLayout>
                }
              />

              <Route
                path='/products/:id'
                element={
                  <DefaultLayout>
                    <ProductDetails />
                  </DefaultLayout>
                }
              />

              <Route
                path='/customization'
                element={
                  <DefaultLayout>
                    <CustomizationPage />
                  </DefaultLayout>
                }
              />

              <Route
                path='/about'
                element={
                  <DefaultLayout>
                    <AboutPage />
                  </DefaultLayout>
                }
              />

              <Route
                path='/contact'
                element={
                  <DefaultLayout>
                    <Contact />
                  </DefaultLayout>
                }
              />

              {/* Protected routes */}
              <Route
                path='/cart'
                element={
                  <DefaultLayout>
                    <Cart />
                  </DefaultLayout>
                }
              />

              <Route
                path='/wishlist'
                element={
                  <ProtectedRoute>
                    <DefaultLayout>
                      <Wishlist />
                    </DefaultLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/orders'
                element={
                  <ProtectedRoute>
                    <DefaultLayout>
                      <Orders />
                    </DefaultLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/account'
                element={
                  <ProtectedRoute>
                    <DefaultLayout>
                      <Account />
                    </DefaultLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/admin'
                element={
                  <ProtectedRoute requireAdmin>
                    <DefaultLayout>
                      <Admin />
                    </DefaultLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
