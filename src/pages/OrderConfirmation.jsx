import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">Thank you for your order</p>
          <p className="text-lg font-semibold text-primary-600 mb-8">
            Order Number: {orderNumber}
          </p>

          <p className="text-gray-600 mb-8">
            We've received your order and will process it shortly. You will receive a confirmation email with order details.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Back to Home
            </Link>
            <Link
              to="/uniforms"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

