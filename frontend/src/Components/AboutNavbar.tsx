import React, { useState } from "react";
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008H12v-.008zM3 10.5a9 9 0 1118 0 9 9 0 01-18 0z"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const PinterestLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 11.25 178.5500030517578 38.29999923706055"
    data-asc="0.959"
    width="178.5500030517578"
    height="38.29999923706055"
  >
    <defs />
    <g fill="#000000">
      <g transform="translate(0, 0)">
        <path d="M15.45 32.05L18.20 32.20Q19.25 32.20 19.85 32.15Q21.20 30.50 22.95 28.35Q26.30 24.35 26.60 23.95Q27.80 22.25 28.85 22.25Q29.40 22.25 29.85 22.60Q30.30 22.95 30.30 23.62Q30.30 24.30 24.40 31.55Q30.75 30.30 35.80 27.60Q40.85 24.90 40.85 21.90Q40.85 20.65 35.68 20.65Q30.50 20.65 24.10 22.00Q17.70 23.35 13.05 25.30Q8.40 27.25 8.40 28.70Q8.40 28.85 8.78 28.85Q9.15 28.85 10.90 28.22Q12.65 27.60 13.25 27.60Q13.85 27.60 14 28.00Q14 29.25 11.22 30.62Q8.45 32.00 5.80 32.00Q3.15 32.00 1.58 30.70Q0 29.40 0 26.55Q0 22.75 4.75 19.12Q9.50 15.50 16.40 13.37Q23.30 11.25 29.70 11.25Q36.10 11.25 40.03 13.70Q43.95 16.15 43.95 21.25Q43.95 23.10 42.43 25.27Q40.90 27.45 38.15 29.52Q35.40 31.60 30.93 33.22Q26.45 34.85 21.20 35.40Q16.20 41.40 13.78 44.27Q11.35 47.15 10.88 47.75Q10.40 48.35 9.65 48.35Q8.90 48.35 8.53 47.82Q8.15 47.30 8.15 46.77Q8.15 46.25 8.45 45.85Q12.60 40.90 16.90 35.70L15.70 35.70Q14.85 35.70 14.08 35.25Q13.30 34.80 13.30 33.87Q13.30 32.95 13.97 32.50Q14.65 32.05 15.45 32.05ZM29.05 46.70Q29.05 47.80 29.80 48.52Q30.55 49.25 31.75 49.25Q32.95 49.25 35.85 46.35Q38.75 43.45 41 40.30Q43.25 37.15 43.25 36.30Q43.25 33.65 41 33.65Q37.40 34.30 33.23 38.75Q29.05 43.20 29.05 46.70M44.15 32.05Q43.30 32.05 42.80 31.45Q42.30 30.85 42.20 30.25L42.15 29.70Q42.40 27.30 44.30 26.05Q46.20 24.80 47.60 24.80Q49.65 24.80 49.65 26.85Q49.65 28.15 48.10 29.97Q46.55 31.80 44.15 32.05ZM60.35 45.70L61.90 45.10Q62.60 45.10 62.60 45.65Q62.60 46.95 60.48 48.12Q58.35 49.30 56.43 49.30Q54.50 49.30 53.45 48.47Q52.40 47.65 52.40 45.95Q52.40 44.25 54.35 41.75Q54.60 41.50 54.60 41.32Q54.60 41.15 54.40 41.15Q54.20 41.15 54.05 41.25Q53.90 41.35 51.90 42.60Q47.10 45.65 45.05 46.85Q44.20 47.30 43.45 47.30Q42.70 47.30 41.80 46.35Q40.90 45.40 40.90 44.45Q40.90 42.45 46.55 37.12Q52.20 31.80 54.20 31.80Q54.95 31.90 55.50 32.65Q56.05 33.40 56.05 34.42Q56.05 35.45 55.30 36.65Q54.20 38.40 53.53 39.07Q52.85 39.75 52.85 39.92Q52.85 40.10 53.00 40.10Q53.15 40.10 53.43 39.92Q53.70 39.75 58.18 36.82Q62.65 33.90 63.20 33.57Q63.75 33.25 64.40 33.25Q65.05 33.25 66.10 33.87Q67.15 34.50 67.15 35.55Q67.15 36.60 65.33 38.65Q63.50 40.70 61.65 42.60Q59.80 44.50 59.80 45.30Q59.80 45.70 60.35 45.70ZM67.05 27.80Q67.05 27.00 71.35 26.35Q75.65 25.70 80.55 25.45Q84.65 21.75 87.95 19.15L89.05 18.25Q89.80 18.25 89.80 19.35L89.90 21.80Q89.75 22.35 87.80 25.25L90.25 25.25Q95.80 25.25 96.68 26.32Q97.55 27.40 97.55 28.05Q97.55 28.90 95.85 28.95Q94.15 29.00 85.20 29.00Q78.05 36.35 74 42.05Q72.45 44.15 71.30 45.80Q70.15 47.45 69.53 48.12Q68.90 48.80 68.35 48.80Q66.70 48.80 65.55 47.70Q64.40 46.60 64.40 45.00Q64.40 40.60 76.65 29.05L68.95 29.05Q67.05 29.05 67.05 27.80ZM87.45 38.25L89.90 38.00Q91.60 38.00 91.60 39.70Q91.60 40.60 89.95 41.70Q88.30 42.80 86.63 43.72Q84.95 44.65 84.95 45.15Q84.95 45.50 85.75 45.60Q87.50 45.60 92.40 42.80Q97.30 40.00 97.65 40.00Q98.35 40.00 98.35 40.70Q98.30 41.20 95.17 43.17Q92.05 45.15 87.88 46.97Q83.70 48.80 81.50 48.80Q78.05 48.80 78.05 45.15Q78.05 44.10 79.47 42.85Q80.90 41.60 82.33 40.70Q83.75 39.80 83.75 39.57Q83.75 39.35 83.05 39.05Q80.95 38.15 80.95 36.65Q80.95 33.85 85.63 31.32Q90.30 28.80 94.30 28.80Q96.50 28.80 97.95 29.62Q99.40 30.45 99.40 32.12Q99.40 33.80 97.08 35.25Q94.75 36.70 93.75 36.70Q93.35 36.70 93.03 36.50Q92.70 36.30 92.70 36.05Q92.70 35.80 94.08 35.22Q95.45 34.65 95.45 34.15Q95.45 33.90 94.72 33.90Q94 33.90 90 35.47Q86 37.05 86 37.70Q86 38.25 87.45 38.25ZM107.10 29.30Q107.45 29.30 107.75 29.62Q108.05 29.95 108.05 30.37Q108.05 30.80 107.55 31.45Q105.60 33.85 104.97 34.47Q104.35 35.10 104.35 35.30Q104.35 35.50 104.67 35.50Q105 35.50 107.35 34.62Q109.70 33.75 110.45 33.75Q111.20 33.75 112 34.37Q112.80 35.00 112.80 35.97Q112.80 36.95 109.75 40.42Q106.70 43.90 106.70 44.95Q106.70 45.15 106.85 45.15Q107.10 45.15 107.75 44.82Q108.40 44.50 108.55 44.50Q109.10 44.50 109.10 44.90Q109.10 46.45 106.65 48.00Q104.20 49.55 102.53 49.55Q100.85 49.55 99.80 48.62Q98.75 47.70 98.75 46.15Q98.75 44.60 100.28 42.67Q101.80 40.75 103.42 39.95Q105.05 39.15 105.05 38.65Q105.05 38.50 105 38.45Q102.80 39.35 101.40 39.35Q98.65 39.35 98.65 37.75Q98.65 35.90 101.85 32.90Q105.05 29.90 107.10 29.30ZM121.20 38.25L123.65 38.00Q125.35 38.00 125.35 39.70Q125.35 40.60 123.70 41.70Q122.05 42.80 120.38 43.72Q118.70 44.65 118.70 45.15Q118.70 45.50 119.50 45.60Q121.25 45.60 126.15 42.80Q131.05 40.00 131.40 40.00Q132.10 40.00 132.10 40.70Q132.05 41.20 128.93 43.17Q125.80 45.15 121.63 46.97Q117.45 48.80 115.25 48.80Q111.80 48.80 111.80 45.15Q111.80 44.10 113.22 42.85Q114.65 41.60 116.08 40.70Q117.50 39.80 117.50 39.57Q117.50 39.35 116.80 39.05Q114.70 38.15 114.70 36.65Q114.70 33.85 119.38 31.32Q124.05 28.80 128.05 28.80Q130.25 28.80 131.70 29.62Q133.15 30.45 133.15 32.12Q133.15 33.80 130.82 35.25Q128.50 36.70 127.50 36.70Q127.10 36.70 126.78 36.50Q126.45 36.30 126.45 36.05Q126.45 35.80 127.83 35.22Q129.20 34.65 129.20 34.15Q129.20 33.90 128.47 33.90Q127.75 33.90 123.75 35.47Q119.75 37.05 119.75 37.70Q119.75 38.25 121.20 38.25ZM137.95 40.60Q135.85 40.60 134.13 39.65Q132.40 38.70 132.40 36.75Q132.40 34.20 136 32.35Q139.60 30.50 143.45 30.50Q145.85 30.50 147.35 31.37Q148.85 32.25 148.83 33.97Q148.80 35.70 146.22 37.07Q143.65 38.45 142.80 38.45Q141.95 38.45 141.95 38.10Q141.95 37.75 142.28 37.57Q142.60 37.40 143.70 36.90Q144.80 36.40 145.30 36.07Q145.80 35.75 145.80 35.55Q145.80 35.35 145.35 35.35Q143.70 35.35 140.18 36.52Q136.65 37.70 136.65 38.45Q136.65 38.90 138.65 38.90Q143.60 38.90 143.60 42.85Q143.60 44.60 141.50 46.02Q139.40 47.45 137.20 48.05Q135 48.65 133.68 48.65Q132.35 48.65 130.75 47.45Q129.15 46.25 129.15 45.05Q129.15 43.85 132.30 43.30Q133.70 43.10 136 42.37Q138.30 41.65 138.30 41.00Q138.30 40.60 137.95 40.60ZM148.05 27.80Q148.05 27.00 152.35 26.35Q156.65 25.70 161.55 25.45Q165.65 21.75 168.95 19.15L170.05 18.25Q170.80 18.25 170.80 19.35L170.90 21.80Q170.75 22.35 168.80 25.25L171.25 25.25Q176.80 25.25 177.68 26.32Q178.55 27.40 178.55 28.05Q178.55 28.90 176.85 28.95Q175.15 29.00 166.20 29.00Q159.05 36.35 155.00 42.05Q153.45 44.15 152.30 45.80Q151.15 47.45 150.53 48.12Q149.90 48.80 149.35 48.80Q147.70 48.80 146.55 47.70Q145.40 46.60 145.40 45.00Q145.40 40.60 157.65 29.05L149.95 29.05Q148.05 29.05 148.05 27.80Z" />
      </g>
    </g>
  </svg>
);

const Footer: React.FC = () => {
  const [isFootnotesOpen, setIsFootnotesOpen] = useState(false);

  return (
    <footer className="bg-white text-gray-900">
      <div className="container mx-auto px-6 py-16">
        {/* 1. Footnotes Accordion */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setIsFootnotesOpen(!isFootnotesOpen)}
            className="flex justify-between items-center w-full py-6"
            aria-expanded={isFootnotesOpen}
          >
            <span className="text-sm font-semibold">Footnotes</span>
            {isFootnotesOpen ? <MinusIcon /> : <PlusIcon />}
          </button>

          {/* Collapsible content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${isFootnotesOpen ? "max-h-96 pb-6" : "max-h-0"}
            `}
          >
            <p className="text-gray-700 max-w-2xl">
              This is where the footnote content would appear.
            </p>
          </div>
        </div>

        {/* 2. Main Footer Links Area - CORRECTED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* LEFT COLUMN: Logo & Language */}
          <div className="space-y-6">
            <a href="/" aria-label="Pinterest home">
              <PinterestLogo />
            </a>
            <button className="flex items-center justify-between w-full max-w-xs px-4 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:border-gray-500">
              <span className="flex items-center gap-2 font-semibold">
                <GlobeIcon />
                English (UK)
              </span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* RIGHT COLUMN: Link Lists (Nested Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Col 2: Quick links */}
            <div>
              <h3 className="font-semibold mb-4">Quick links</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <a href="#" className="hover:underline">
                    Press assets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Subscribe via RSS
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <a href="#" className="hover:underline">
                    About Pinterest
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Investors
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: More from Pinterest */}
            <div>
              <h3 className="font-semibold mb-4">More from Pinterest</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <a href="#" className="hover:underline">
                    Help Centre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Businesses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Creators
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Developers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Sub-Footer (Bottom Bar) */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-x-6 gap-y-2">
            <span>© 2025 Pinterest</span>
            <a href="#" className="hover:underline">
              Copyright and Trademark
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy and Cookies
            </a>
            <a href="#" className="hover:underline">
              Cookie preferences
            </a>
            <a href="#" className="hover:underline">
              Personalised ads
            </a>
          </div>
          <p className="mt-2">Pinterest status</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
