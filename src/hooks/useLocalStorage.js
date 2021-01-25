import React, { useState, useEffect } from 'react'


export default function useLocalStorage(key) {

    // creo uno spazio nel local storage con un nome del tipo:   "conv-userName-withName"
    // in modo che ad un differente login cambi userName e quindi l'insieme delle converazioni

    const clearStorage = () => {
        localStorage.clear()
    }

    const loadAllConv = () => {
        const res = []
        const allStoreKey = Array.from(Object.keys(localStorage))
        allStoreKey.map((from) => {
            const jsonValue = localStorage.getItem(from)
            console.log("jsonValue", jsonValue)
            if (jsonValue != null) res.push(JSON.parse(jsonValue))
        })
        return res
    }

    //carica le conversazioni con gli user contenuti nell'array users. Restituisccce un array di conversazioni
    const loadConv = (users) => {
        const res = []
        const allStoreKey = Array.from(Object.keys(localStorage))
        if (Array.isArray(users)) {
            users.map(user => {
                const indice = allStoreKey.findIndex(el => el.substring(key.length + 1) === user.userName)
                if (indice > -1) {
                    const jsonValue = localStorage.getItem(key + "-" + user.userName)
                    if (jsonValue != null) res.push(JSON.parse(jsonValue))
                }
            })
        }
        else {

            const indice = allStoreKey.findIndex(el => el.substring(key.length + 1) === users)
            if (indice > -1) {
                const jsonValue = localStorage.getItem(key + "-" + users)
                if (jsonValue != null) res.push(JSON.parse(jsonValue))
            }

        }
        return res
    }


    /* utilizzate */
    const loadSingleConv = (username) => {
        const jsonValue = localStorage.getItem(key + "-" + username)
        if (jsonValue != null) return JSON.parse(jsonValue)
        else return false
    }


    const storeConv = (conversation, recipient) => {
        localStorage.setItem(key + "-" + recipient, JSON.stringify(conversation))
    }

    const storeMessageToConv = (msg, username) => {
        let currConv

        const oldConv = loadSingleConv(username)
        if (oldConv) {
            currConv = {
                ...oldConv,
                msgs: [...oldConv.msgs, msg]
            }
        }
        else {
            currConv = { with: username, msgs: [msg] }

        }
        localStorage.setItem(key + "-" + username, JSON.stringify(currConv))
    }

    const getLastMessage = (myName, username) => {
        const loadedConv = loadSingleConv(username)
        if (loadedConv && loadedConv.msgs.length > 0) {
            const lastMsg = loadedConv.msgs[loadedConv.msgs.length - 1]
            if (lastMsg.from === myName && lastMsg.read)
                return (
                    <>
                        <i className="fa fa-check checkReadIcon small-text mr-1"></i>
                        { lastMsg.body}
                    </>
                )
            else
                return lastMsg.body
        }
        else return ""
    }
    const totMsgToRead = (myName, username, recipient) => {

        let totMsgToRead = []
        const loadedConv = loadSingleConv(username) 
        if (loadedConv) {
            if (loadedConv.with !== recipient) {
                totMsgToRead = loadedConv.msgs.filter(m => {
                    if (m.read === false && m.from !== myName) {
                        return true
                    }
                })
            }
        }
        return totMsgToRead.length
    }

    return {
        loadSingleConv, loadConv, loadAllConv, storeConv, storeMessageToConv,
        getLastMessage, totMsgToRead
    }
}

