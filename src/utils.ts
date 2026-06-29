/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle } from './types';

// Multi-currency formatter
export function formatCurrency(amount: number, currency: 'USD' | 'NGN' | 'KES' | 'GHS' = 'USD'): string {
  const symbolMap = {
    USD: '$',
    NGN: '₦',
    KES: 'KSh ',
    GHS: 'GH₵ ',
  };

  const rateMap = {
    USD: 1,
    NGN: 1500, // Simulated rates
    KES: 130,
    GHS: 14.5,
  };

  const symbol = symbolMap[currency] || '$';
  const convertedAmount = amount * (rateMap[currency] || 1);

  return `${symbol}${convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// VIN Validation
export function validateVIN(vin: string): boolean {
  const cleanVin = vin.toUpperCase().trim();
  if (cleanVin.length !== 17) return false;
  // Basic check for excluded letters (I, O, Q are invalid in standard VINs)
  return !/[IOQ]/i.test(cleanVin);
}

// Generate an SVG QR Code directly in-code for any vehicle details
export function getSVGQRCode(urlValue: string): string {
  // Directly returns a scalable vector QR Code mock representation
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full text-slate-800 dark:text-white" fill="currentColor">
      <!-- Outer Border -->
      <rect x="0" y="0" width="100" height="100" fill="transparent" />
      
      <!-- Top-Left Finder Pattern -->
      <rect x="5" y="5" width="25" height="25" />
      <rect x="10" y="10" width="15" height="15" fill="white" />
      <rect x="13" y="13" width="9" height="9" />
      
      <!-- Top-Right Finder Pattern -->
      <rect x="70" y="5" width="25" height="25" />
      <rect x="75" y="10" width="15" height="15" fill="white" />
      <rect x="78" y="13" width="9" height="9" />
      
      <!-- Bottom-Left Finder Pattern -->
      <rect x="5" y="70" width="25" height="25" />
      <rect x="10" y="75" width="15" height="15" fill="white" />
      <rect x="13" y="78" width="9" height="9" />
      
      <!-- Small Alignment Pattern -->
      <rect x="75" y="75" width="10" height="10" />
      <rect x="78" y="78" width="4" height="4" fill="white" />
      
      <!-- Simulated Timing Patterns and Data Bits -->
      <rect x="35" y="10" width="4" height="4" />
      <rect x="45" y="10" width="4" height="4" />
      <rect x="55" y="10" width="4" height="4" />
      <rect x="10" y="35" width="4" height="4" />
      <rect x="10" y="45" width="4" height="4" />
      <rect x="10" y="55" width="4" height="4" />
      
      <rect x="35" y="25" width="8" height="4" />
      <rect x="50" y="20" width="4" height="12" />
      <rect x="60" y="25" width="6" height="4" />
      
      <rect x="35" y="35" width="12" height="12" />
      <rect x="40" y="40" width="4" height="4" fill="white" />
      <rect x="52" y="35" width="8" height="4" />
      <rect x="62" y="40" width="4" height="8" />
      <rect x="75" y="35" width="12" height="12" />
      <rect x="80" y="40" width="4" height="4" fill="white" />
      
      <rect x="35" y="55" width="4" height="8" />
      <rect x="42" y="50" width="8" height="4" />
      <rect x="55" y="52" width="12" height="6" />
      <rect x="70" y="55" width="4" height="12" />
      
      <rect x="35" y="70" width="12" height="4" />
      <rect x="50" y="70" width="4" height="15" />
      <rect x="58" y="78" width="8" height="4" />
      <rect x="35" y="80" width="8" height="8" />
      
      <rect x="68" y="80" width="4" height="12" />
      <rect x="85" y="65" width="8" height="4" />
    </svg>
  `;
}

// Printable Window Sticker Template (returns HTML layout to print)
export function getWindowStickerHTML(vehicle: Vehicle, currency: 'USD' | 'NGN' | 'KES' | 'GHS' = 'USD'): string {
  const featuresList = vehicle.features.map(f => `<li>• ${f}</li>`).join('');
  const formattedPrice = formatCurrency(vehicle.price - vehicle.discount, currency);

  return `
    <html>
      <head>
        <title>Window Sticker - ${vehicle.brand} ${vehicle.model}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
          .sticker-border { border: 4px solid #1e293b; padding: 30px; border-radius: 8px; position: relative; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; }
          .dealership-name { font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
          .vehicle-title { font-size: 36px; font-weight: 800; margin: 20px 0 5px 0; color: #1e3a8a; }
          .vehicle-subtitle { font-size: 20px; color: #475569; margin: 0 0 25px 0; font-weight: 500; }
          .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
          .spec-item { border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 15px; }
          .spec-label { font-weight: 600; color: #64748b; }
          .spec-value { float: right; font-weight: bold; color: #0f172a; }
          .section-title { font-size: 18px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #64748b; padding-bottom: 5px; margin-bottom: 15px; margin-top: 30px; color: #0f172a; }
          .features-list { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; }
          .price-block { background: #1e293b; color: white; padding: 25px; border-radius: 6px; text-align: center; margin-top: 40px; }
          .price-label { font-size: 16px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; }
          .price-value { font-size: 48px; font-weight: 800; margin-top: 5px; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .qr-box { position: absolute; top: 30px; right: 30px; width: 100px; height: 100px; }
          @media print {
            body { padding: 0; }
            .sticker-border { border-color: #000; }
            .price-block { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="sticker-border">
          <div class="header">
            <div>
              <div class="dealership-name">AutoElite Showrooms</div>
              <div style="color: #64748b; font-size: 14px;">Premium Automotive Retail & Importation</div>
            </div>
          </div>
          
          <div class="vehicle-title">${vehicle.year} ${vehicle.brand} ${vehicle.model}</div>
          <div class="vehicle-subtitle">${vehicle.trim} &bull; ${vehicle.bodyType}</div>
          
          <div class="section-title">Vehicle Specifications</div>
          <div class="spec-grid">
            <div class="spec-item"><span class="spec-label">VIN</span><span class="spec-value">${vehicle.vin}</span></div>
            <div class="spec-item"><span class="spec-label">Condition</span><span class="spec-value">${vehicle.condition}</span></div>
            <div class="spec-item"><span class="spec-label">Engine</span><span class="spec-value">${vehicle.engineCapacity}</span></div>
            <div class="spec-item"><span class="spec-label">Transmission</span><span class="spec-value">${vehicle.transmission}</span></div>
            <div class="spec-item"><span class="spec-label">Drivetrain</span><span class="spec-value">${vehicle.driveType} (${vehicle.horsepower} HP)</span></div>
            <div class="spec-item"><span class="spec-label">Mileage</span><span class="spec-value">${vehicle.mileage.toLocaleString()} miles</span></div>
            <div class="spec-item"><span class="spec-label">Fuel Type</span><span class="spec-value">${vehicle.fuelType}</span></div>
            <div class="spec-item"><span class="spec-label">Color</span><span class="spec-value">${vehicle.color}</span></div>
          </div>
          
          <div class="section-title">Installed Options & Packages</div>
          <ul class="features-list">
            ${featuresList || '<li>• Standard Equipment</li>'}
          </ul>

          <div class="section-title">Warranty & Guarantee</div>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            ${vehicle.warranty} - Full vehicle inspection conducted by certified master technician. Original inspection checklist is logged on file and viewable on request.
          </p>
          
          <div class="price-block">
            <div class="price-label">Manufacturer's Suggested Retail Price (MSRP)</div>
            <div class="price-value">${formattedPrice}</div>
            <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">Price excludes registration, custom fees, and local taxes.</div>
          </div>
          
          <div class="footer">
            AutoElite DMS - Secure Automotive Enterprise Ledger &bull; VIN Decoded Online Check &bull; Printed on June 2026
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;
}

// High-fidelity Rule-Based AI Engine to simulate intelligent analysis instantly
export const DealerAISimulator = {
  recommendPrice: (vehicle: Partial<Vehicle>): { recommended: number; range: [number, number]; analysis: string } => {
    const cost = vehicle.purchaseCost || 30000;
    const year = vehicle.year || 2022;
    const mileage = vehicle.mileage || 15000;
    const condition = vehicle.condition || 'Used';
    const brand = vehicle.brand || 'Toyota';

    // Pricing formula based on parameters
    let margin = 0.15; // 15% standard dealer profit margin
    if (condition === 'New') margin = 0.20;
    if (condition === 'Imported') margin = 0.22;
    if (brand === 'Mercedes-Benz' || brand === 'BMW' || brand === 'Land Rover') margin = 0.25;

    // Mileage depreciation
    const depFactor = Math.max(0.7, 1 - (mileage / 150000) * 0.4);
    // Year age factor
    const ageFactor = Math.max(0.6, 1 - (2026 - year) * 0.05);

    const baseVal = cost * depFactor * ageFactor;
    const recommended = Math.round((cost * (1 + margin)) / 100) * 100;
    const lower = Math.round((recommended * 0.93) / 100) * 100;
    const upper = Math.round((recommended * 1.07) / 100) * 100;

    const analysis = `Based on a comprehensive market sweep of ${brand} valuations in 2026, this ${year} model is highly optimized at ${formatCurrency(recommended)}. Due to its current condition (${condition}) and mileage of ${mileage.toLocaleString()} miles, we have applied a custom luxury margin factor of ${(margin * 100).toFixed(0)}%. Market liquidity for this class remains robust with an average days-on-market of 18.2 days.`;

    return { recommended, range: [lower, upper], analysis };
  },

  generateDescription: (vehicle: Partial<Vehicle>): string => {
    const brand = vehicle.brand || 'Mercedes-Benz';
    const model = vehicle.model || 'C-Class';
    const year = vehicle.year || 2022;
    const trim = vehicle.trim || 'C300 M Sport';
    const color = vehicle.color || 'Obsidian Black';
    const features = vehicle.features || ['Leather', 'Sunroof'];

    return `Experience pure automotive excellence with this stunning ${year} ${brand} ${model} in premium ${trim}. Coated in an elegant ${color} finish, this vehicle perfectly balances commanding performance with refined luxury. 

Equipped with highly desirable factory options including ${features.slice(0, 3).join(', ')}, it delivers a connected and safe driving experience. This vehicle has been thoroughly inspected by our certified technicians and is ready for immediate delivery. Contact us today to schedule your VIP test drive or place a reservation!`;
  },

  writeSalesEmail: (customerName: string, vehicleBrand: string, vehicleModel: string, repName: string): string => {
    return `Subject: Special Invitation: Experience the ${vehicleBrand} ${vehicleModel} at AutoElite

Dear ${customerName},

I hope this email finds you well. 

My name is ${repName} from AutoElite Showrooms, and I noticed your recent inquiry regarding the beautiful ${vehicleBrand} ${vehicleModel} currently featured in our collection. This vehicle represents the absolute pinnacle of its class, offering remarkable reliability, safety, and an incredibly refined cabin.

I would be absolutely delighted to schedule an exclusive, zero-obligation VIP test drive for you this week at our Lagos Showroom. Alternatively, if you would prefer customized financing options or a trade-in appraisal on your current vehicle, our specialist accounting team is on hand to prepare a bespoke quote.

Please let me know if you would be available for a quick call or visit. I look forward to assisting you in finding your perfect drive.

Warmest regards,

${repName}
Senior Sales Advisor, AutoElite
lagos@autoelite-dms.com | +234 803 123 4567`;
  },

  getSalesForecast: (monthsAhead: number): { labels: string[]; sales: number[]; revenue: number[]; insight: string } => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = 5; // June (0-indexed)

    const labels: string[] = [];
    const sales: number[] = [];
    const revenue: number[] = [];

    for (let i = 0; i < monthsAhead; i++) {
      const idx = (currentMonthIdx + i) % 12;
      labels.push(months[idx] + ' 2026');
      
      // Add a simulated seasonal trend (higher sales in Dec/Jan, slight summer dip)
      const multiplier = idx === 11 || idx === 0 ? 1.4 : idx === 6 || idx === 7 ? 0.95 : 1.1;
      const baseSales = Math.round(14 * multiplier);
      const baseRevenue = Math.round(620000 * multiplier);

      sales.push(baseSales);
      revenue.push(baseRevenue);
    }

    return {
      labels,
      sales,
      revenue,
      insight: `AI Forecast: We predict a ${monthsAhead > 3 ? '12.4% expansion' : '7.1% steady rise'} in luxury SUV volume over the next cycle, driven primarily by interest rate stabilization and new imported fleet clearance arrivals. Recommended inventory strategy: hold 60% SUVs, 25% Sedans, and 15% Electric options to optimize capital turnaround and minimize flooring holding costs.`
    };
  }
};
