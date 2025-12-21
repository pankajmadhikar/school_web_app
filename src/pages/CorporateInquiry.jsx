import { useState } from 'react';
import { publicAPI } from '../utils/api';
import { CheckCircle, Loader, Send } from 'lucide-react';

function CorporateInquiry() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    requirement: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await publicAPI.createInquiry(formData);
      setSuccess(true);
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        requirement: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
              Corporate Uniform Inquiry
            </h1>
            <p className="text-xl text-gray-600">
              Looking for bulk corporate uniforms? Get in touch with us!
            </p>
          </div>

          {success ? (
            <div className="bg-white rounded-lg shadow-xl p-12 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                We've received your inquiry and will contact you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-primary"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Requirements *</label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Please describe your uniform requirements, quantity needed, delivery timeline, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CorporateInquiry;

