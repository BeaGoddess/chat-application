import React, { useState, useEffect, useContext } from "react";

function Profile() {

    const [hover, setHover] = useState("Teste")
    let listItems = ["Dashboard", "Teste", "Olá"]

    const hoverDiv = (item) => {
        setHover(item)
    }

    return (
        <>
            <div className={`bg-blue-400 p-2 ${listItems.indexOf(hover) === 0 ? "rounded-br-lg" : ""}`}>
            </div>

            {listItems.map((item) => {
                return (<>
                    <div className={`bg-blue-400 
                    ${hover !== item ? "p-2" : "pl-2"} 
                    ${listItems.indexOf(item) === listItems.indexOf(hover) - 1 ? "rounded-br-lg" : listItems.indexOf(item) === listItems.indexOf(hover) + 1 ? "rounded-tr-lg" : ""}`}
                        onMouseOver={(e) => hoverDiv(item)}>
                        {hover === item ?
                            <div className="bg-white py-2 rounded-l-lg pl-4">
                                {item}
                            </div> : item}

                    </div>
                </>)
            })}

            <div className={`bg-blue-400 p-2 ${listItems.indexOf(hover) === listItems.length - 1 ? "rounded-tr-lg" : ""}`}>
            </div>

        </>
    )
}

export default Profile