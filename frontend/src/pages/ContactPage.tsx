import React from 'react';
import { Phone, MapPin, Clock, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="bg-teal-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-teal-200">We'd love to hear from you</p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-teal-700 mb-4">Get in Touch</h2>
            <p className="text-gray-600">Visit us, call us, or order online. We're here 7 days a week!</p>
          </div>

          {[
            { icon: Phone, label: 'Phone', value: '+91 9827483385', href: 'tel:9827483385', action: 'Call Now' },
            { icon: Mail, label: 'Email', value: 'komal@restaurant.com', href: 'mailto:komal@restaurant.com', action: 'Send Email' },
            { icon: MapPin, label: 'Address', value: 'PWRM+5CF, Nayapara Ward, Bhatapara, Chhattisgarh 493118', href: 'https://maps.google.com/?q=Bhatapara+CG', action: 'Get Directions' },
            { icon: Clock, label: 'Hours', value: 'Monday – Sunday: 9:00 AM – 11:00 PM', href: null, action: null },
          ].map(({ icon: Icon, label, value, href, action }) => (
            <div key={label} className="card p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-teal-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 font-medium">{label}</p>
                <p className="text-gray-800 font-medium mt-0.5">{value}</p>
              </div>
              {href && (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="btn-ghost btn-sm flex items-center gap-1 shrink-0 text-teal-700">
                  {action} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}

          {/* Delivery info */}
          <div className="card p-5 bg-teal-50 border border-teal-200">
            <h3 className="font-semibold text-teal-700 mb-3">🛵 Delivery Charges</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Within Bhatapara (0–1 km)</span><span className="font-semibold text-teal-700">₹50</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Nearby areas (above 1 km)</span><span className="font-semibold text-teal-700">₹80</span></div>
            </div>
          </div>

          <div className="flex gap-4">
            <a href="https://wa.me/919827483385" target="_blank" rel="noreferrer" className="btn-primary flex-1 justify-center">
              💬 WhatsApp Us
            </a>
            <Link to="/menu" className="btn-secondary flex-1 justify-center">
              🍽️ View Menu
            </Link>
          </div>
        </div>

        {/* Map */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-teal-700">Find Us</h2>
          <div className="rounded-2xl overflow-hidden shadow-card h-80 md:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683!2d81.9943!3d21.7299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDQzJzQ3LjYiTiA4McKwNTknMjMuOCJF!5e0!3m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="KOMAL Restaurant on Google Maps"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Bhatapara+Chhattisgarh"
            target="_blank"
            rel="noreferrer"
            className="btn-outline w-full justify-center"
          >
            <ExternalLink className="w-4 h-4" /> Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
