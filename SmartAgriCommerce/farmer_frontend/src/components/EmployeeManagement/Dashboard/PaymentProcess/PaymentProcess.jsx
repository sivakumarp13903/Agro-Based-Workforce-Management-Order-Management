// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// // import "./PaymentGateway.css"; // Add styling if needed

// const PaymentProcess = () => {
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => {
//             setScrolled(window.scrollY > 50);
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     return (
//         <div>
//             {/* Navigation Header */}
//             <header className={`recruit-header ${scrolled ? "scrolled" : ""}`}>
//                 <nav>
//                     <ul className="nav-list">
//                         <li className="nav-item"><Link to="/recruit-management/application" className="nav-link">Job Application</Link></li>
//                         <li className="nav-item"><Link to="/recruit-management/workprogress" className="nav-link">Work List</Link></li>
//                         <li className="nav-item"><Link to="/recruit-management/payment-process" className="nav-link">Payment Process</Link></li>
//                         <li className="nav-item"><Link to="/recruit-management/post-job" className="nav-link">Post Job</Link></li>
//                     </ul>
//                 </nav>
//             </header>

//             {/* Payment Processing Section */}
//             <main className="payment-container">
//                 <h1>💳 Payment Gateway</h1>
//                 <p>Manage and process payments for recruited workers securely.</p>
                
//                 {/* Placeholder for Payment Integration */}
//                 <div className="payment-box">
//                     <p>🔒 Secure Payment Processing</p>
//                     <button className="payment-btn">Proceed to Payment</button>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default PaymentProcess;


import React from 'react'

const PaymentProcess = () => {
  return (
    <div>PaymentProcess</div>
  )
}

export default PaymentProcess