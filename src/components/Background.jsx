import React from 'react';

const Background = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-[#f4f4f4] -z-10">
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Background;
