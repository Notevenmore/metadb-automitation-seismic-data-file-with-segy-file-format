import Image from 'next/image';
import Link from 'next/link';
import Buttons from '../components/buttons/buttons';

const Action = () => {
  return (
    <div className="flex flex-row gap-x-1 items-center">
      <Image
        src="/icons/magnify.svg"
        width={50}
        height={50}
        className="w-[25px] h-[15px] alt='' "
        alt="icon"
      />
      <Link href="/basin/edit">
        <Image
          src="/icons/pencil.svg"
          width={50}
          height={50}
          className="w-[25px] h-[15px] alt='' "
          alt="icon"
        />
      </Link>
      <Image
        src="/icons/delete.svg"
        width={50}
        height={50}
        className="w-[25px] h-[15px] alt='' "
        alt="icon"
      />
    </div>
  );
};

export default {
  header: ['No', 'Name', 'KKS', 'Wilayah Kerja', 'Jenis', 'AFE', 'Action'],
  content: [
    {
      no: 1,
      name: 'Laporan 2023',
      KKS: 'GTN',
      'wilayah kerja': 'Jakarta',
      jenis: 'Not set',
      AFE: 'Not set',
      action: <Action />,
    },
  ],
};
