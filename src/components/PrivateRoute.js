
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

import React, { useContext, useEffect, useState } from 'react'

export default function PrivateRoute({ children, ...rest }) {
    const { user } = useAuth()

    return (
        <Route
            {...rest}
            render={({ location }) =>
                user.name ? (
                    children
                )
                    : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />

    );
}