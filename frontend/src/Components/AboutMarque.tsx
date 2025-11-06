// src/components/LeadershipSection.tsx
import React from "react";
import HoverImageScroller from "./HoverImageScroller";

// --- DUMMY DATA ---
// Replace these with your actual data and image URLs
const leadershipTeam = [
  {
    id: 1,
    name: "Leader 1",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/1gukZH8YQTSkIcGmVCjGNr/dd395ec62ea3aab147f66b1297670029/PIN_Company_Leadership-Mallard.jpg?fm=webp&q=85",
  },
  {
    id: 2,
    name: "Leader 2",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/xOh4RXzIceUPo4cbzPws3/1a4261e813e7abac6829dad2dbb9c2a7/PIN_Company_Leadership-Watkins.jpg?fm=webp&q=85",
  },
  {
    id: 3,
    name: "Leader 3",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/4xMOPpudD5u4jAgzhsFFVN/4012f778265cd2255bd98f34fb4fa6ec/PIN_Company_Leadership-Ducard.jpg?fm=webp&q=85",
  },
  {
    id: 4,
    name: "Leader 4",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/2xoAn1HoQs3XaM0wjn8cYz/0f4583ec8edd9d55144279640b235c5a/PIN_Company_Leadership-Madrigal.png?fm=webp&q=85",
  },
  {
    id: 5,
    name: "Leader 5",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/15EcpSoNUcZXYlxlBRhJ5l/64316d8a2840130947a5dbb5fb99a935/PIN_Company_Leadership-Ready.jpg?fm=webp&q=85",
  },
  {
    id: 6,
    name: "Leader 6",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/34vvaD2NkimPihVyGjDbUU/18025b96302a1cfa06acf646a3a10b8a/Kh2-Dw0O.jpeg?fm=webp&q=85",
  },
  {
    id: 7,
    name: "Leader 7",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/1g8hEtbWzsGMWO4cVOhBe0/8368fc6d467d9dc0a9e3568a1dbf01c1/PIN_Company_Leadership-Donnelly.jpg?fm=webp&q=85",
  },
];
// ------------------

const LeadershipSection: React.FC = () => {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-6 text-center">
        {/* Header Content */}
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Meet Pinterest's leadership
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Get to know our executive team.
        </p>
        <button className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-all duration-300">
          Meet the team
        </button>
      </div>

      {/* Image Scroller */}
      <div className="mt-20">
        <HoverImageScroller items={leadershipTeam} />
      </div>
    </div>
  );
};

export default LeadershipSection;
