import React, { useEffect, useState } from "react";
import { supabase } from "./sign-up";

export const getuid = () =>{
    const[uid,setuid]=useState(null)
    useEffect(()=>{
        const fetchUID=async ()=>{
            const {data:{user},error}= await supabase.auth.getUser()
            if (user){
                setuid(user.id)
            }
        }
        fetchUID()
    },[])
    // console.log(uid)
    return uid
}