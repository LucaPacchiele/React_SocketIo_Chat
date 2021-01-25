import React, { useEffect, useState, useRef } from 'react'
import { Nav, Alert, Row, Col, Badge } from 'react-bootstrap'
import { update } from "jdenticon";

import { useAuth } from "../context/AuthProvider";
import useLocalStorage from '../hooks/useLocalStorage'


export default function UtenteOnline({ userName, recipient }) {
    const { user } = useAuth()
    const { getLastMessage, totMsgToRead } = useLocalStorage("conv-" + user.name)

    return (

        <>
            <canvas id={userName} width="45" height="45" className="canvasAvatarUsers d-flex"></canvas>
            <div className=" d-flex flex-column flex-grow-1 minWidthZero">
                <div className="ml-3 wrapDots">{userName}</div>
                <div className="ml-3 small-text wrapDots">{getLastMessage(user.name, userName)}</div>
            </div>

            <div>
                <Badge variant="info" className="p-2">
                    {totMsgToRead(user.name, userName, recipient) > 0 && totMsgToRead(user.name, userName, recipient)}
                </Badge>
            </div>
        </>



    )
}
