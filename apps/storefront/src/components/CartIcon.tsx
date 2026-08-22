/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description CartIcon — Icône panier personnalisée SVG (fidèle au design fourni par le client)
 * @created 2026-08-22
 * @updated 2026-08-22
 * 🌐 ceo.nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import React from 'react';

interface CartIconProps {
  className?: string;
  strokeWidth?: number;
}

export const CartIcon: React.FC<CartIconProps> = ({
  className = 'w-5 h-5',
  strokeWidth = 28,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Tige du caddie */}
    <polyline points="24,40 100,40 190,340 420,340" />
    {/* Panier (corps) */}
    <polyline points="190,120 490,120 440,340" />
    {/* Roue gauche */}
    <circle cx="190" cy="430" r="38" fill="currentColor" stroke="none" />
    {/* Roue droite */}
    <circle cx="390" cy="430" r="38" fill="currentColor" stroke="none" />
  </svg>
);
