import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { ColorSchemeScript } from '@mantine/core'
import { supabase } from './supabase'
import React from 'react'
import { AuthProvider } from './context/AuthContext';
import { AuthForm } from './components/AuthForm';


function App() {

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <AuthProvider>
          <AuthForm />
        </AuthProvider>
      </MantineProvider>
    </>
  )
}

export default App


