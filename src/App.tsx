import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { ColorSchemeScript } from '@mantine/core'
import { supabase } from './supabase'
import React from 'react'

function App() {
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('boats').select('*')
        if (error) throw error
        setIsConnected(true)
      } catch (err) {
        console.error('Failed to connect to Supabase:', err)
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
      <div>
          {isConnected ? (
            <p>Successfully connected to Supabase!</p>
          ) : (
            <p>Loading... Please wait.</p>
          )}
      </div>
      </MantineProvider>
    </>
  )
}

export default App


