
import { Button } from "react-bootstrap"
import { Route, Redirect } from "react-router-dom";

import { useSocket } from "../context/SocketProvider";

import React, { useContext, useEffect, useState } from 'react'

export default function ConnectedRoute({ children, ...rest }) {

    const { socketInfo, setNewConnection } = useSocket()
    const { socketStatus } = socketInfo

    return (
        <Route
            {...rest}
            render={() =>
                socketStatus === "Connesso" ? (
                    children
                ) : (
                        <div className="d-flex justify-content-center">
                            <Button variant="warning" className="mr-5 p-3 w-100" onClick={() => {
                            setNewConnection(true)
                        }}>Connetti al server</Button>
                        </div>

                    )
            }
        />

    );
}