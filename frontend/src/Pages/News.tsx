import NewsWithTabs from "../Components/NewsWithTabs";
import AboutFooter from "../Components/Footer";

import { Briefcase, Paintbrush, BarChart3, ArrowUpRight } from "lucide-react";

const navItems = [
  {
    title: "For businesses",
    icon: <Briefcase size={32} strokeWidth={1.5} />,
    link: "#",
  },
  {
    title: "For creators",
    icon: <Paintbrush size={32} strokeWidth={1.5} />,
    link: "#",
  },
  {
    title: "For investors",
    icon: <BarChart3 size={32} strokeWidth={1.5} />,
    link: "#",
  },
];

const News = () => {
  return (
    <>
      <section className="bg-white">
        <div className="max-w-5xl rounded-xl mx-auto px-6 py-16">
          {/* Section label */}
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Featured news
          </h2>

          {/* Main Card */}
          <div className="bg-gray-50  p-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* LEFT: Text Content */}
            <div className="max-w-2xl">
              <h3 className="text-2xl lg:text-3xl font-semibold leading-tight text-gray-900">
                Pinterest Predicts™:
                <br />
                Nonconformity, self-preservation, and escapism drive 21 trends
                for 2026
              </h3>

              <p className="mt-10 text-xl text-gray-500">9 December 2025</p>
            </div>{" "}
            {/* RIGHT: Image Grid */}
            <div className="grid grid-cols-4">
              {[
                "https://images.ctfassets.net/2pyx8rwuvz6x/4AaQE0jKZA1suhHKxubbcq/bdcf9dde43feff337028e79d5f377b0f/PenPals.png?fm=webp&q=85&w=656&h=656",
                "https://images.ctfassets.net/2pyx8rwuvz6x/5RTSO0DWT62lf6hWjABUvS/0cf97a04357b3792894fe5f5ce04bc2b/CabbageCrush-min.jpg?fm=webp&q=85&w=1440&h=1440",
                "https://images.ctfassets.net/2pyx8rwuvz6x/bkalwF2tqH1GhTD04XjrL/a388a3a827aa0bccec2019b7bc307350/Brooched.jpg?fm=webp&q=85&w=2880&h=2880",
                "https://images.ctfassets.net/2pyx8rwuvz6x/350251TCDlm6Gd69HYjn2q/c7607a7345df616310e9aea4cf31228a/Darcations.jpg?fm=webp&q=85&w=2880&h=2880",
                "https://images.ctfassets.net/2pyx8rwuvz6x/6f83n3q1bB7R32NKjMcuc6/d18fccc8f07f3f349a5f3cdf810b6ae2/1TXTGimmeGummy.jpg?fm=webp&q=85&w=2880&h=2880",
                "https://images.unsplash.com/photo-1492447166138-50c3889fccb1",
                "https://images.ctfassets.net/2pyx8rwuvz6x/6f83n3q1bB7R32NKjMcuc6/d18fccc8f07f3f349a5f3cdf810b6ae2/1TXTGimmeGummy.jpg?fm=webp&q=85&w=2880&h=2880",
                "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b",
                "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd",
                "https://images.ctfassets.net/2pyx8rwuvz6x/4AaQE0jKZA1suhHKxubbcq/bdcf9dde43feff337028e79d5f377b0f/PenPals.png?fm=webp&q=85&w=656&h=656",
              ].map((src, i) => (
                <div key={i} className="aspect-[3/4] overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <NewsWithTabs />
      <section className="bg-white py-12 px-6 md:py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Image Container */}
          <div className="w-full md:w-1/2">
            <img
              src="https://images.ctfassets.net/2pyx8rwuvz6x/1SRVJ498dFAUNTtJpY51rK/1903495f1f4783f90fe9b7ea37d6c0e2/Bill_Ready_Homepage_4x5__1_.jpg?fm=webp&q=85"
              alt="Pinterest CEO Bill Ready"
              className="w-full h-auto rounded-[2rem] object-cover shadow-sm"
            />
          </div>

          {/* Text Content Container */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              A word from our CEO
            </h2>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-8">
              Pinterest CEO Bill Ready shares why making the phone a ‘one-stop
              shop’ for secure, private and effective age verification is
              essential to protect teens online.
            </p>
            <button className="px-6 py-3 border-2 border-black rounded-full font-semibold text-gray-900 hover:bg-gray-100 transition-colors duration-200">
              Read more
            </button>
          </div>
        </div>
      </section>
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
            Looking for something else?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group flex flex-col items-center"
              >
                {/* Card Container */}
                <div className="w-full aspect-[16/7] bg-[#efede8] rounded-3xl flex items-center justify-center my-10 transition-colors duration-300 group-hover:bg-[#e2e0db]">
                  <div className="text-gray-900">{item.icon}</div>
                </div>

                {/* Label with Arrow */}
                <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                  <span>{item.title}</span>
                  <ArrowUpRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <AboutFooter />
    </>
  );
};

export default News;
