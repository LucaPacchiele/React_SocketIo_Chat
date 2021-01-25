import React, { useEffect, useState, useRef } from 'react'
import { Nav, Alert, Row, Col, Badge } from 'react-bootstrap'
import { update } from "jdenticon";

import { useAuth } from "../context/AuthProvider";
import useLocalStorage from '../hooks/useLocalStorage'


import UtenteOnline from './UtenteOnline'


export default function ListaUtentiOnline({ recipient, setRecipient, onlineUsers, conv, searchValue, setSearchValue, searchRef }) {
    const { user } = useAuth()
    const { getLastMessage, totMsgToRead } = useLocalStorage("conv-" + user.name)


    useEffect(() => {
        const timerAvatar = setInterval(() => {
            const lista = document.querySelectorAll("div.usersList > canvas");
            lista.forEach(c => {
                update(`#${c.id}`, c.id)
            })
        }, 500);

        return () => {
            clearInterval(timerAvatar)
        }
    }, [])




    const checkSearch = (username) => {
        if (username.toUpperCase().includes(searchValue.toUpperCase())) return true
        return false
    }

    // const getLastMessage = (name) => {
    //     const c = conv.find(e => e.with === name)
    //     if (c) {
    //         if (c.msgs.length > 0) {
    //             const lastMsg = c.msgs[c.msgs.length - 1]
    //             if (lastMsg.from === user.name && lastMsg.read)
    //                 return (
    //                     <>
    //                         <i className="fa fa-check checkReadIcon small-text mr-1"></i>
    //                         { lastMsg.body}
    //                     </>
    //                 )
    //             else
    //                 return lastMsg.body
    //         }
    //     }
    //     else return ""
    // }





    // const totMsgToRead = (name) => {
    //     let totMsgToRead = 0
    //     const c = conv.find(e => e.with === name)
    //     if (c) {
    //         if (c.with !== recipient) {
    //             totMsgToRead = c.msgs.filter(m => {
    //                 if (m.read === false && m.from !== user.name) {
    //                     return true
    //                 }
    //             })

    //         }
    //     }
    //     return totMsgToRead.length
    // }

    return (

        <div id="UtentiOnline" className="d-flex flex-column">
            <div className="text-center pb-2 small-text">Online: {onlineUsers.length}</div>

            {onlineUsers.map((el, index) => (

                checkSearch(el.userName) &&

                <div key={index} className={recipient === el.userName ?
                    "usersList contactLink d-flex align-items-center justify-content-between  contactActive " :
                    "usersList contactLink d-flex align-items-center justify-content-between "}
                    onClick={() => {
                        setRecipient(el.userName)
                        setSearchValue("")
                        searchRef.current.value = ""
                    }}>


                    <UtenteOnline userName={el.userName} recipient={recipient} />

                </div>
            ))}
        </div>

    )
}
