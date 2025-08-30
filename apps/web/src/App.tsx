import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './components/DefaultLayout';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ProductsPage } from './pages/Products';
import { CustomizationPage } from './pages/Deals';
import { About } from './pages/About';
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
              <About />
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
            <DefaultLayout>
              <Wishlist />
            </DefaultLayout>
          }
        />

        <Route
          path='/orders'
          element={
            <DefaultLayout>
              <Orders />
            </DefaultLayout>
          }
        />

        <Route
          path='/account'
          element={
            <DefaultLayout>
              <Account />
            </DefaultLayout>
          }
        />

        <Route
          path='/admin'
          element={
            <DefaultLayout>
              <Admin />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
