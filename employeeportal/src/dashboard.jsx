import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInactivityLogout from './useInactivityLogout';
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        localStorage.removeItem('emailAddress');
        navigate('/');
    };

    useInactivityLogout(300000); // 5 minutes

    useEffect(() => {
        fetch("https://backend-payment-system-hjco.onrender.com/api/payments/getAll", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch payments');
                return res.json();
            })
            .then(data => {
                setPayments(data);
                localStorage.setItem('payments', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error fetching payments:', error);
            });
    }, []);

    const handleProcessClick = (id) => {
        setSelectedPaymentId(id);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            await axios.post(`https://backend-payment-system-hjco.onrender.com/api/payments/processPayment/${selectedPaymentId}`);
            setShowModal(false);
            setSuccessMessage("✅ Payment submitted to SWIFT successfully.");
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("❌ Failed to process payment.");
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="#">Payment System</a>
                    <div className="collapse navbar-collapse">
                        <span className="navbar-text ms-auto">
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </span>
                    </div>
                </div>
            </nav>

            <div className="container mt-5">
                <h1 className="text-center">Welcome Employee: {localStorage.getItem('fullName')}</h1>

                <h2 className="mt-4">Payments</h2>
                {payments.length === 0 ? (
                    <p>No payments found.</p>
                ) : (
                    <table className="table table-bordered mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Sender Account No</th>
                                <th>Receiver Account No</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Provider</th>
                                <th>Swift Code</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>{payment.id}</td>
                                    <td>{payment.senderAccount}</td>
                                    <td>{payment.receiverAccount}</td>
                                    <td>{payment.amount.toFixed(2)}</td>
                                    <td>{payment.currency}</td>
                                    <td>{payment.provider}</td>
                                    <td>{payment.swiftCode}</td>
                                    <td>{payment.status}</td>
                                    <td>{new Date(payment.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleProcessClick(payment.id)}>
                                            Process payment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Submission</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to submit payment ID {selectedPaymentId} to SWIFT?</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button className="btn btn-success" onClick={handleConfirm}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
                {successMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
