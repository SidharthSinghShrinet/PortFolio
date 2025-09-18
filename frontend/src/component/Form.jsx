import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Form = () => {
  return (
    <div className="w-full h-full">
      <form className="grid lg:w-[80%] items-center gap-4.5">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name" className={`text-xl font-normal`}>
            Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="Your Name"
            className="bg-white h-10 text-lg font-normal text-gray-700 tracking-wider"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className={`text-xl font-normal`}>
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Your Email"
            className="bg-white h-10 text-lg font-normal text-gray-700 tracking-wider"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="message" className={`text-xl font-normal`}>
            Your Message
          </Label>
          <Textarea
            placeholder="Write your message here."
            id="message"
            className="bg-white min-h-30 text-lg font-normal text-gray-700 tracking-wider"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button className="w-full bg-indigo-700 hover:bg-indigo-600 h-10">Button</Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
