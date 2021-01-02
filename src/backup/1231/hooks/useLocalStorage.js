import React, { useState, useEffect } from 'react'

const PREFIX = 'live-chat-'

export default function useLocalStorage(key) {

    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(PREFIX + key)
        if (jsonValue != null) return JSON.parse(jsonValue)
    })

    useEffect(() => {
        localStorage.setItem(PREFIX + key, JSON.stringify(value))
    }, [value])

    return [value, setValue]
}

