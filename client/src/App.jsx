import ViewBookDetails from './components/View-book-details/ViewBookDetails';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Routes, Route } from "react-router-dom";
import AllBooks from './pages/AllBooks';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from "./store/auth";
import { useEffect } from 'react';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("role") &&
      localStorage.getItem("token")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content with flex-grow to push footer down */}
      <main className="flex-grow">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />}>
            <Route index element={<Favourites />} />
            <Route path="/profile/orderHistory" element={<UserOrderHistory />} />
            <Route path="/profile/settings" element={<Settings />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;