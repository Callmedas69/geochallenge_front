import React from "react";

const Page = () => {
  return (
    <div className="relative flex items-center justify-center w-full bg-white text-black font-[League_Spartan]">
      {/* Canvas */}
      <div className="flex w-[1200px] h-[630px] bg-white border border-gray-200 shadow-xl">
        {/* LEFT COLUMN */}
        <div className="flex flex-col w-[40%] justify-between">
          {/* Pack Image */}
          <div className="flex items-center justify-center h-[90%]">
            <div className="flex items-center justify-center w-[340px] h-[460px] bg-gray-100 rounded-lg shadow-md text-6xl text-gray-400">
              image here
            </div>
          </div>

          {/* Footer Logo */}
          <div className="flex flex-row h-[10%] items-end justify-start pl-6 pb-6">
            <div className="text-6xl font-black pr-2">G</div>
            <div className="flex flex-col leading-none">
              <div className="font-black text-2xl">GEOCHALLENGE</div>
              <div className="text-xs italic text-gray-500">
                powered by GeoArt
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col w-[60%] justify-between">
          {/* Top Section (Competition Info) */}
          <div className="flex flex-col justify-center h-[90%] px-12 space-y-3">
            <div className="uppercase text-sm tracking-wider font-semibold text-gray-600">
              TRADING CARD COMPETITION · BUILT FOR VIBEMARKET
            </div>

            <div className="text-7xl font-black font-[Barriecito] leading-tight tracking-tight">
              COLLECTION NAME
            </div>

            <div className="text-lg text-gray-600 max-w-[85%]">
              Competition description goes here. It’s kept short and readable
              for social cards or preview banners.
            </div>

            <div className="pt-4 space-y-1 text-lg">
              <div>
                Prize Pool:{" "}
                <span className="font-bold text-amber-500">
                  0.01 ETH and growing
                </span>
              </div>
              <div>
                Deadline:{" "}
                <span className="font-bold text-blue-600">
                  Ends within 2 days
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Tagline */}
          <div className="flex items-center justify-end h-[10%] px-8 pb-4">
            <div className="font-bold italic uppercase tracking-widest text-gray-800">
              COMPETE · COLLECT · CONQUER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
