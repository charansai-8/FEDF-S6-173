import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ProductCard from './components/ProductCard'

function App() {
  

  return (
    <div>
      <h1>My Shop</h1>
      <ProductCard name="Phone" price={15000} image="phone image.jpg"/>
      <ProductCard name="Laptop" price={50000} image="laptop.jpg"/>
      <ProductCard name="Headphones" price={2000} image="headphone.jpg"/>
    </div>
      
  );
}

export default App
