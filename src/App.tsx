import { Outlet, Routes, Route, BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Box, Container, CircularProgress, Alert } from '@mui/material'
import { TemplateList } from './components/templates/TemplateList'
import { TemplateForm } from './components/templates/TemplateForm'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Box display="flex" height="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={
              <Container sx={{ mt: 4 }}>
                <Outlet />
              </Container>
            } />
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/template/create" element={<TemplateForm />} />
            <Route path="/template/edit/:id" element={<TemplateForm />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  )
}

export default App