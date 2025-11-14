import MasonryGrid from "../Components/MasonryGrid";
import BusinessTabs from "../Components/BusinessTabs";

const PinterestBusinessLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
          Grow your business
          <br />
          on Pinterest
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-10">
          Pinterest is where people discover new ideas, plan and shop.
          <br />
          With Pinterest ads, you can reach your audience at every
          <br />
          stage of the consumer journey. Sign up for a free business
          <br />
          account to access ads and other marketing tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-3 text-base font-semibold text-gray-900 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition duration-300">
            Sign up
          </button>
          <button className="px-8 py-3 text-base font-semibold text-gray-900 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition duration-300">
            Request meeting
          </button>
        </div>
      </section>

      <MasonryGrid />
      {/* Ad Experience Section */}
      <h1 className="text-4xl md:text-6xl flex font-bold text-center py-24 justify-center px-16">
        The No. 1 reason people use Pinterest is to find new products and
        brands1
      </h1>
      <section className="w-full flex justify-center py-24 px-6 bg-white">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image Card */}
          <div className="relative flex justify-center">
            <div className="relative w-[520px] md:w-[580px] rounded-3xl overflow-hidden">
              <img
                src="https://images.ctfassets.net/h67z7i6sbjau/7D0WciFj4YMR9fi0I07zZk/3e8847ff5d228347cfd3fc3658920cc3/biz-homepage-adprop.png?fm=webp&q=85"
                alt="product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-3xl font-bold leading-tight text-gray-900">
              A place where ads <br /> don’t feel like ads
            </h2>

            <p className="text-base text-gray-700 leading-relaxed">
              Weekly Pinterest users are more likely to say that ads feel
              relevant on Pinterest, compared to people using other platforms.
              Because people on Pinterest are here to take action, ads actually
              enhance their experience—they don’t detract from it.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all">
                How Pinterest works
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-100 transition-all">
                Learn about ads
              </button>
            </div>
          </div>
        </div>
      </section>
      <h1 className="text-4xl md:text-5xl flex font-bold text-center py-14 justify-center ">
        Effective solutions for every goal
      </h1>
      <BusinessTabs />
    </div>
  );
};

export default PinterestBusinessLayout;
