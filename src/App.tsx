import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ColorModeProvider } from './components/ui/color-mode';
import RootLayout from './layouts/RootLayout';
import system from './theme';
import NotFound from './components/common/NotFound';
import SignupCard from './components/common/SignupForm';
import ComponentPlayground from './components/common/ComponentPlaygroud';

function App() {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/signup' element={<SignupCard />} />
            <Route path='/' element={<RootLayout />}>
              <Route index element={<NotFound />} />
              <Route path='/components' element={<ComponentPlayground />} />
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
