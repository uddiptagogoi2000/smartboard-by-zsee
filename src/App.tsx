import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ColorModeProvider } from './components/ui/color-mode';
import RootLayout from './layouts/RootLayout';
import system from './theme';
import NotFound from './components/common/NotFound';
import SignupCard from './components/common/SignupForm';
import ComponentPlayground from './components/common/ComponentPlaygroud';
import AuthLayout from './layouts/AuthLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route
                path='/signup'
                element={
                  <AuthLayout>
                    <SignupCard />
                  </AuthLayout>
                }
              />
              <Route path='/' element={<RootLayout />}>
                <Route index element={<NotFound />} />
                <Route path='/components' element={<ComponentPlayground />} />
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
