import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Note-Library</h3>
            <p className="text-gray-600 mb-4">
              Empowering students with comprehensive study materials and interactive learning experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="nav-link">About Us</a></li>
              <li><a href="#" className="nav-link">Study Materials</a></li>
              <li><a href="#" className="nav-link">Practice Tests</a></li>
              <li><a href="#" className="nav-link">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="nav-link">Help Center</a></li>
              <li><a href="#" className="nav-link">Terms of Service</a></li>
              <li><a href="#" className="nav-link">Privacy Policy</a></li>
              <li><a href="#" className="nav-link">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-600">
                <MapPin size={18} />
                <span>Kathmandu,Nepal</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Phone size={18} />
                <span>9813131313</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Mail size={18} />
                <span>support@notelibrary.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Note-Library. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;