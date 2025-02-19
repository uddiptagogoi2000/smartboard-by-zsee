import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SigninForm from './components/auth/SigninForm';
import SignupForm from './components/auth/SignupForm';
import ComponentPlayground from './components/common/ComponentPlaygroud';
import NotFound from './components/common/NotFound';
import Private from './components/routes/Private';
import { ColorModeProvider } from './components/ui/color-mode';
import { Toaster } from './components/ui/toaster';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import system from './theme';
import RootLayout from './layouts/RootLayout';
import Public from './components/routes/Public';
import DashboardListPage from './pages/DashboardListPage';
import DashboardDetailsPage from './pages/DashboardDetailsPage';
import { DashboardProvider } from './components/context/DashboardRefactor';
import TopicListPage from './pages/TopicListPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<RootLayout />}>
                <Route
                  path='signup'
                  element={
                    <Public>
                      <AuthLayout>
                        <SignupForm />
                      </AuthLayout>
                    </Public>
                  }
                />
                <Route
                  path='signin'
                  element={
                    <Public>
                      <AuthLayout>
                        <SigninForm />
                      </AuthLayout>
                    </Public>
                  }
                />
                <Route
                  path=''
                  element={
                    <Private>
                      <DashboardLayout />
                    </Private>
                  }
                >
                  {/* <Route index element={<NotFound />} /> */}
                  <Route
                    // index
                    path='/dashboards'
                    element={<DashboardListPage />}
                  />
                  <Route
                    path='/dashboards/:id'
                    element={
                      <DashboardProvider>
                        <DashboardDetailsPage />
                      </DashboardProvider>
                    }
                  />
                  <Route path='/topics' element={<TopicListPage />} />
                  {/* <Route path='/devices' element={<DeviceListPage />} /> */}
                  <Route path='/components' element={<ComponentPlayground />} />
                  <Route path='*' element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
