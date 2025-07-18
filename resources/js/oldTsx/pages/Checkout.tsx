import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = ({ cart = { items: [
  { product: { name: 'Red Roses Bouquet', price: 49.99 }, quantity: 1 },
  { product: { name: 'Orchid Plant', price: 29.99 }, quantity: 2 },
] } }: { cart?: any }) => (
  <>
    <Navbar />
    <div className="container py-5">
      <h1>Checkout</h1>
      <form className="row g-3 mt-4" style={{maxWidth: 600, margin: '0 auto'}}>
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">Phone</label>
          <input type="text" className="form-control" />
        </div>
        <div className="col-12">
          <h5 className="mt-4">Order Summary</h5>
          <ul className="list-group mb-3">
            {cart.items.map((item: any, i: number) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                {item.product?.name} <span>x{item.quantity}</span>
                <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
              Total
              <span>${cart.items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0).toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">Place Order</button>
        </div>
      </form>
    </div>
    <Footer />
  </>
);

export default Checkout;
