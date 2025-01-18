import Image from 'next/image';
import React from 'react';

interface SubtitleProps {
  text: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ text }) => {
  return (
    <span className="hero-subtitle-gradient hover:hero-subtitle-hover bg-white relative mb-5 inline-flex items-center gap-2 rounded-full px-8 py-2 text-3xl font-medium shadow-md">
      <Image
        alt="icon"
        loading="lazy"
        width={30}
        height={30}
        decoding="async"
        src="/svgs/icon-title.svg"
        style={{ color: "transparent" }}
      />
      <span className="hero-subtitle-text font-medium">{text}</span>
     
    </span>
  );
};

export default Subtitle;