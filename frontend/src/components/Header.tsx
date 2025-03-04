// Header.tsx

import { RiRobot3Fill } from 'react-icons/ri';

function Header() {
  return (
    <>
      <div className="flex gap-2 items-center pt-15 pb-10 px-20">
        <RiRobot3Fill color="#6958D1" size={40} />
        <p className="text-3xl font-bold">Scout</p>
      </div>
    </>
  );
}

export default Header;
