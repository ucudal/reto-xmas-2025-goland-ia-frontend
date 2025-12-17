import { Routes, Route } from 'react-router-dom'
import WebClone from './components/WebClone'
import ProductsPage from './components/WebClone/ProductsPage'
import ProductDetailPage from './components/WebClone/ProductDetailPage'
import Chatbot from './components/Chatbot/Chatbot'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WebClone />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:productId" element={<ProductDetailPage />} />
      </Routes>
      <Chatbot />
    </>
  )
}
