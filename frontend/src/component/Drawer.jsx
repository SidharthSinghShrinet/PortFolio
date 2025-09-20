import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ImCross } from "react-icons/im";
import MenuIcon from "@mui/icons-material/Menu";
import { IoIosHome } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { MdContactPhone } from "react-icons/md";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const toggle = useSelector((state)=>state.global.toggle);
  const listItems = [
    {
        text:"Home",
        comp:<IoIosHome/>,
        id:"home"
    },
    {
        text:"About",
        comp:<IoIosInformationCircleOutline/>,
        id:"about"
    },
    {
        text:"Skills",
        comp:<FaBookOpen/>,
        id:"skills"
    },
    {
        text:"Projects",
        comp:<MdWork/>,
        id:"projects"
    },
    {
        text:"Education",
        comp:<PiStudent/>,
        id:"education"
    },
    {
        text:"Contact",
        comp:<MdContactPhone/>,
        id:"contact"
    }
  ];
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  function handleClick(id){
    setOpen(false);
    const section = document.getElementById(id);
    if(section){
        section.scrollIntoView({behavior:"smooth"})
    }
  }
  const DrawerList = (
    <Box sx={{ width: 300, height:"100%" , background:toggle?"white":"black", color:toggle?"black":"white"}} role="presentation" onClick={toggleDrawer(false)}>
      <div className="flex justify-between items-center font-bold tracking-wider">
        <p className="text-2xl pl-1.5 py-3"><span className={`${toggle?"text-black":"text-purple-500"}`}>S</span>iDHArt<span className={`${toggle?"text-black":"text-purple-500"}`}>H</span></p>
        <div className="pr-2.5 text-lg font-bold cursor-pointer"><ImCross/></div>
      </div>
      <Divider/>
      <div className="mt-2">
        {listItems.length===0?"Loading...":(
        listItems.map((item,idx)=>(
            <div key={idx} onClickCapture={()=>handleClick(item.id)} className="flex justify-start items-center text-2xl gap-3 py-2 px-0.5">
                <div className="cursor-pointer">{item.comp}</div>
                <p className="cursor-pointer hover:underline">{item.text}</p>
            </div>
        ))
      )}
      </div>
    </Box>
  );

  return (
    <div>
      <button onClick={toggleDrawer(true)}>
        <MenuIcon />
      </button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
