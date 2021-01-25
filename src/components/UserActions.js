import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'

import { useAuth } from "../context/AuthProvider";
import { update } from "jdenticon";
import { useHistory } from "react-router-dom";

function UserActions({ searchValue, setSearchValue, searchRef }) {
    const { user, signout } = useAuth()
    let history = useHistory();

    useEffect(() => {
        const timerAvatar = setInterval(() => {
            update("#myAvatar", user.name)
        }, 500);

        return () => {
            clearInterval(timerAvatar)
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const handleChange = (e) => {
        setSearchValue(e.target.value)
    }



    return (
        <div className="d-flex flex-column w-100  ">
            <div className="">
                <div className="d-flex flex-column align-items-center ">
                    <div className="d-flex">
                        <canvas id="myAvatar" className="m-2 canvasAvatarUsername" width="70" height="70"></canvas>
                        <div className="buttonLogout ml-2" onClick={() => {
                            history.push("/login");
                            signout()
                        }}><i className="fa fa-times"></i>
                        </div>
                    </div>
                    <h3 className="wrapWord w-100 text-center  ">{user.name}</h3>
                </div>

            </div>

            <form onSubmit={e => handleSubmit(e)}>
                <div className="searchUserOnline mt-2">
                    <input type="text" className="searchBar" placeholder="Search..."
                        onChange={(e) => { handleChange(e) }} ref={searchRef} />
                    <div className="searchButtonIcon">
                        <i className="fa fa-search"></i>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default UserActions
