import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const Form = () => {
  const toggle = useSelector((state)=>state.global.toggle);
  let [userData,setUserData] = useState({
    "Name":"",
    "Email":"",
    "Message":""
  });
  let [result,setResult] = useState("");
  // console.log(result);
  function handleChange(e){
    let {name,value} = e.target;
    setUserData({...userData,[name]:value})
  }

  async function handleSubmit(event){
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "9327affd-bc0b-4c46-b25b-84a27001d85d");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Form Submitted Successfully");
      setResult("Form Submitted Successfully");
      event.target.reset();
      setUserData({Name:"",Email:"",Message:""});
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  }
  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit} className="grid lg:w-[80%] items-center gap-4.5">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name" className={`text-xl font-normal ${toggle?"text-black":" text-white"}`}>
            Name
          </Label>
          <Input
            type="text"
            id="name"
            required={true}
            placeholder="Your Name"
            value={userData.Name}
            name="Name"
            onChange={handleChange}
            className={`${toggle?"bg-white text-gray-500":"bg-black text-gray-200"} h-10 text-lg font-normal tracking-wider`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className={`text-xl font-normal ${toggle?"text-black":" text-white"}`}>
            Email
          </Label>
          <Input
            type="email"
            id="email"
            required={true}
            placeholder="Your Email"
            name="Email"
            value={userData.Email}
            onChange={handleChange}
            className={`${toggle?"bg-white text-gray-500":"bg-black text-gray-200"} h-10 text-lg font-normal tracking-wider`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="message" className={`text-xl font-normal ${toggle?"text-black":" text-white"}`}>
            Your Message
          </Label>
          <Textarea
            placeholder="Write your message here."
            name="Message"
            required={true}
            value={userData.Message}
            onChange={handleChange}
            id="message"
            className={`bg-white min-h-30 text-lg font-normal tracking-wider ${toggle?"bg-white text-gray-500":"bg-black text-gray-200"}`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button className="w-full text-md bg-indigo-700 hover:bg-indigo-600 h-10">Send Message</Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
