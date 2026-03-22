import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppDataProvider } from './context/AppDataContext';
import Navbar from './components/Navbar';
import MovieAssistant from './components/MovieAssistant';
import Homepage from './pages/Homepage';
import Browse from './pages/Browse';
import Details from './pages/Details';
import MovieDetails from './pages/MovieDetails';
import ShowDetails from './pages/ShowDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AddEdit from './pages/AddEdit';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const App: FC = () => {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/shows/:id" element={<ShowDetails />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/add" element={<AddEdit />} />
                <Route path="/edit/:id" element={<AddEdit />} />
              </Routes>
            </main>
            <MovieAssistant />
          </div>
        </Router>
      </AppDataProvider>
    </ThemeProvider>
  );
}

export default App;
