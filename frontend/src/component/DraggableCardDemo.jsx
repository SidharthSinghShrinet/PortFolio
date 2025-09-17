import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { useSelector } from "react-redux";

export function DraggableCardDemo(props) {
  const { items } = props;
  const toggle = useSelector((state)=>state.global.toggle);
  // console.log(items);
  // console.log(items[0].icon);
  // const items = [
  //   {
  //     title: "Tyler Durden",
  //     image:
  //       "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-10 left-[20%] rotate-[-5deg]",
  //   },
  //   {
  //     title: "The Narrator",
  //     image:
  //       "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-40 left-[25%] rotate-[-7deg]",
  //   },
  //   {
  //     title: "Iceland",
  //     image:
  //       "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-5 left-[40%] rotate-[8deg]",
  //   },
  //   {
  //     title: "Japan",
  //     image:
  //       "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-32 left-[55%] rotate-[10deg]",
  //   },
  //   {
  //     title: "Norway",
  //     image:
  //       "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-20 right-[35%] rotate-[2deg]",
  //   },
  //   {
  //     title: "New Zealand",
  //     image:
  //       "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-24 left-[45%] rotate-[-7deg]",
  //   },
  //   {
  //     title: "Canada",
  //     image:
  //       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     className: "absolute top-8 left-[30%] rotate-[4deg]",
  //   },
  // ];
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <p className={`absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black ${toggle?"text-neutral-800":"text-neutral-400"} md:text-4xl `}>
        Every skill learned is a step toward a greater future.
      </p>
      {items.map((item, index) => (
        <DraggableCardBody className={item.className} key={index}>
          <div className="flex flex-wrap gap-2">
            {item.items.map((ele,idx)=>(
              <div key={idx} className="bg-black text-white text-xl rounded-2xl w-fit px-4 py-1">{ele}</div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="text-3xl text-purple-950">{item.icon}</div>
            <div className="text-xl font-semibold text-gray-700">{item.title}</div>
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
