import Image from 'next/image';
import {CSSProperties} from 'react';

interface RoundImageProps {
  source: string;
  width: number;
  style?: CSSProperties;
}

export default function RoundImage({source, width, style}: RoundImageProps) {
  return (
    <Image
      className="object-scale-none rounded-full"
      src={source}
      width={width}
      style={style}
      alt="profile"
    />
  );
}
