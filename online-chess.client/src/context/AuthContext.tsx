import {useState, useEffect } from 'react'

export default function AuthContext() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    async function login() {
        setIsAuthenticated(true);
    }

    async function logout() {
        setIsAuthenticated(false);
    }

    useEffect(() => {

        //

    }, [isAuthenticated])

  return (
    <div>AuthContext</div>
  )
}
