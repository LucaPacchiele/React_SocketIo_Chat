import React, { useState, useEffect } from 'react'

const PREFIX = 'live-chat-'

export default function useLocalStorage(key) {

    //ogni volta carica tutti i messaggi
    // const [value, setValue] = useState(() => {
    //     const jsonValue = localStorage.getItem(PREFIX + key)
    //     if (jsonValue != null) return JSON.parse(jsonValue)
    // })

    // useEffect(() => {
    //     localStorage.setItem(PREFIX + key, JSON.stringify(value))
    // }, [value])


    // //carica solo i messaggi inviati con un particolare recipient
    // const loadValue = (me, recipient) => {
    //     let msgs = []

    //     Array.from(value).forEach((el) => {
    //         console.log("EL", el)
    //         if (el.to === recipient || el.from === recipient)
    //             msgs.push(el)
    //     })

    //     //da ordinare secondo la data msgs.time, poi return
    //     return msgs

    // }


    //ritorna tutti i messaggi salvati nel db locale (nel quale user.name è coinvolto)
    const loadValue = (username) => {
        const jsonValue = localStorage.getItem(PREFIX + key + "-" + username)
        if (jsonValue != null) return JSON.parse(jsonValue)
    
    }

    const saveValue = (username, valueToSave) => {
        localStorage.setItem(PREFIX + key + "-" + username, JSON.stringify(valueToSave))

    }


    return [loadValue, saveValue]
}

