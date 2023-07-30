import Image from 'next/image';
import {CSSProperties} from 'react';

interface RoundImageProps {
  source: string;
  width: number;
  style?: CSSProperties;
  additionalClass?: string;
}

export default function RoundImage({source, width, style, additionalClass}: RoundImageProps) {
  return (
    <Image
      className={`object-scale-none rounded-full ${additionalClass}`}
      src={source}
      width={width}
      height={width}
      style={style}
      alt="profile"
    />
  );
}
