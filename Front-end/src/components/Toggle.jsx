import React, { useEffect, useState } from 'react'

export default function Toggle() {
    const[theme , setTheme] = useState(localStorage.getItem("theme" || "light"))

    useEffect(()=>{
        document.body.setAttribute("data-theme" , theme)
        localStorage.setItem("theme" , theme)
    },[theme])
  return (
    <>
    <button onClick={()=>setTheme(theme==="light" ? "dark" : "light")} style={{backgroundColor:"var(--right)",color:"var(--text)" , border:"none"}}>
        {theme === "light" ? <i class="fa-solid fa-sun"></i> :  <i class="fa-regular fa-moon"></i>}
        </button>
    </>
  ) 
}
