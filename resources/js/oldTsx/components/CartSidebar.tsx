import React from 'react';

const CartSidebar = ({ cart = { items: [] }, onClose }: { cart?: any, onClose: () => void }) => (
  <div className="offcanvas offcanvas-end show d-block" tabIndex={-1} style={{visibility: 'visible', background: 'rgba(0,0,0,0.1)'}}>
    <div className="offcanvas-header">
      <h5 className="offcanvas-title">Your Cart</h5>
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
    </div>
    <div className="offcanvas-body p-0">
      <ul className="list-group list-group-flush">
        {cart.items.length ? cart.items.map((item: any, i: number) => (
          <li className="list-group-item d-flex align-items-center" key={i}>
            <img src={item.product?.image} alt={item.product?.name} className="me-2 rounded" style={{width: 48, height: 48, objectFit: 'cover'}} />
            <div className="flex-grow-1">
              <div className="fw-bold">{item.product?.name}</div>
              <div className="small text-muted">Qty: {item.quantity}</div>
            </div>
            <div className="fw-bold ms-2">${(item.product?.price * item.quantity).toFixed(2)}</div>
            <button className="btn btn-sm btn-outline-danger ms-2">&times;</button>
          </li>
        )) : <li className="list-group-item text-center">Your cart is empty.</li>}
      </ul>
    </div>
    <div className="offcanvas-footer p-3 border-top">
      <a href="/cart" className="btn btn-primary w-100">View Cart</a>
    </div>
  </div>
);

export default CartSidebar;
