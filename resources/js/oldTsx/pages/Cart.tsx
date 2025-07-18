import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = ({ cart = { items: [
  { product: { name: 'Red Roses Bouquet', price: 49.99, image: 'https://via.placeholder.com/80x80?text=Red+Roses' }, quantity: 1 },
  { product: { name: 'Orchid Plant', price: 29.99, image: 'https://via.placeholder.com/80x80?text=Orchid' }, quantity: 2 },
] } }: { cart?: any }) => (
  <>
    <Navbar />
    <div className="container py-5">
      <h1>Shopping Cart</h1>
      <div className="table-responsive mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.items.length ? cart.items.map((item: any, i: number) => (
              <tr key={i}>
                <td className="d-flex align-items-center gap-2">
                  <img src={item.product?.image} alt={item.product?.name} style={{width: 48, height: 48, objectFit: 'cover'}} className="rounded" />
                  {item.product?.name}
                </td>
                <td>{item.quantity}</td>
                <td>${item.product?.price}</td>
                <td>${(item.product?.price * item.quantity).toFixed(2)}</td>
                <td><button className="btn btn-sm btn-danger">Remove</button></td>
              </tr>
            )) : <tr><td colSpan={5}>Your cart is empty.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="text-end">
        <a href="/checkout" className="btn btn-success">Proceed to Checkout</a>
      </div>
    </div>
    <Footer />
  </>
);

export default Cart;
