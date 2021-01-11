import React, { useEffect, useState, useRef } from 'react'
import { Nav, Alert, Row, Col, Badge } from 'react-bootstrap'
import { update } from "jdenticon";


export default function ListaUtentiOnline({ recipient, setRecipient, onlineUsers, conv }) {
    const [searchValue, setSearchValue] = useState("")
    const searchRef = useRef()

    useEffect(() => {
        const timerAvatar = setInterval(() => {
            fx()
        }, 500);

        return () => {
            clearInterval(timerAvatar)
        }
    }, [])

    const fx = () => {
        const lista = document.querySelectorAll("div.userList > canvas");
        lista.forEach(c => {
            update(`#${c.id}`, c.id)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const handleChange = (e) => {
        setSearchValue(e.target.value)
    }

    const checkSearch = (username) => {
        if (username.toUpperCase().includes(searchValue.toUpperCase())) return true
        return false
    }

    const getLastMessage = (name) => {
        const c = conv.find(e => e.with === name)
        if (c) {
            if (c.msgs.length>0) 
            return c.msgs[c.msgs.length-1].body
        }
        else return ""
    }

    

    const totMsgToRead = (name) => {
        let totMsgToRead = 0
        const c = conv.find(e => e.with === name)
        if (c) {
            if (c.with !== recipient) {
                totMsgToRead = c.msgs.filter(m => m.read === false).length
            }
        }
        return totMsgToRead
    }

    return (
        <div>
            <div className="m-0 p-0" style={{ height: "10vh" }}>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="searchUserOnline">
                        <input type="text" className="searchBar" placeholder="Search..."
                            onChange={(e) => { handleChange(e) }} ref={searchRef} />
                        <div className="searchButtonIcon">
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                </form>
            </div>

            <div id="UtentiOnline" className="row d-flex flex-column" style={{ height: "70vh" }}>

                <div className="justify-content-end overflow-auto " >
                <div className="text-center pb-2 small-text">Online: {onlineUsers.length}</div>

                    {onlineUsers.map((el, index) => (

                        checkSearch(el.userName) &&

                        <div key={index} className={recipient === el.userName ?
                            "contactLink contactActive d-flex align-items-center justify-content-between " :
                            "contactLink               d-flex align-items-center  justify-content-between "}
                            onClick={() => {
                                setRecipient(el.userName)
                                setSearchValue("")
                                searchRef.current.value = ""
                            }}>

                            <div className="d-flex align-items-center userList">
                                <canvas id={el.userName} width="45" height="45" className="canvasAvatarUsers"></canvas>
                                <div>
                                    <div className="ml-3">{el.userName}</div>
                                    <div className="ml-3 small-text">{getLastMessage(el.userName)}</div>
                                </div>
                            </div>
                            <div>
                                <Badge variant="info" className="p-2">
                                    {totMsgToRead(el.userName) > 0 && totMsgToRead(el.userName)}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
