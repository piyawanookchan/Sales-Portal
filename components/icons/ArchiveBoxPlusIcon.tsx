import React from 'react';

export const ArchiveBoxPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5m-7.5 0-1 3m7.5 0-1 3m0 0h-5.5m5.5 0-1 3m-4-3-1-3m1.5 6h4.5m-4.5 0-1.5 4.5M12 15h4.5m-4.5 0-1.5 4.5m1.5-4.5V12m6.75 4.5h-1.5V12m-2.25 6.75-1.5-4.5M4.5 12.75l-1.5 4.5M4.5 12.75l1.5-4.5M19.5 12.75l-1.5 4.5M19.5 12.75l1.5-4.5M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9ZM12 6v6m0 0v6m0-6h6m-6 0H6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-3.995-2.247a.75.75 0 00-.928.656v11.184a.75.75 0 00.928.656L21 15.75V7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a8.25 8.25 0 1016.5 0 8.25 8.25 0 00-16.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 000-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l4.005-2.247a.75.75 0 01.928.656v11.184a.75.75 0 01-.928.656L3 15.75V7.5z" />
  </svg>
);

// A simpler icon if the above is too complex
export const SimpleArchiveBoxPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M12 15V7.5M12 7.5h3.75m-3.75 0H8.25M3.75 7.5H20.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3" />
    </svg>
);

// Even simpler icon
export const BoxPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5M3 7.5L12 3l9 4.5M21 7.5H3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v6m3-3h-6" />
    </svg>
);

// I'll export a clean one that works well visually.
export default BoxPlusIcon;
