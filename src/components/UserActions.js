import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'

import { useAuth } from "../context/AuthProvider";
import { update } from "jdenticon";
import { useHistory } from "react-router-dom";

function UserActions() {
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



    return (

        <div className="UserActions d-flex align-items-center justify-content-between pt-5 pb-5" style={{ height: "20vh" }}>
            <div className="d-flex align-items-center ml-2">
                <canvas id="myAvatar" className="mr-4 canvasAvatarUsername" width="70" height="70"></canvas>
                <h3 className="mr-4">{user.name}</h3>
            </div>
            <div className="buttonLogout p-2" onClick={() => {
                history.push("/login");
                signout()
            }}><i className="fa fa-times"></i>
            </div>
        </div>
    )
}

export default UserActions
