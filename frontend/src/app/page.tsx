import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to the world</h2>
        <p className="text-lg text-gray-700">
          This is a simple top page with a Header and Footer component styled using TailwindCSS.
        </p>
      </div>
    </div>
  );
};

export default page;
