import React, { useContext } from 'react';
import BurgerButton from '../BurgerButton';
import { LeftSideBarContext } from '../index';
import './style.scss';

const TopSection = () => {
  const { setIsShowSidebar } = useContext(LeftSideBarContext);
  return (
    <div className="LeftSideBar__TopSection">
      <BurgerButton
        onClick={() => setIsShowSidebar(true)}
      />
      {/* <a href="/" className="a_position"> */}
        <h1 className="Welcome_Content">Welcome,UltiChart</h1>
      {/* </a> */}
      <a href="/login" >
        <h6 className="Logout_Content">Log out</h6>
      </a>
    </div>
  );
};

// const onClickWelcomehandle=()=>{
//   <Link to="/">
//     <Button>nihao</Button>
//   </Link>
// }

export default TopSection;