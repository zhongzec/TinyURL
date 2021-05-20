import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { signout, isAuth } from '../helpers/auth'

import logo from './res/logo.png'

const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top p-3">
                <div className="container">
                    <span className="navbar-brand">
                        <Link to="/home">
                            <img src={logo} alt="logo" width="60%"/>
                        </Link>
                    </span>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="nav-collapse">
                        <ul className="navbar-nav d-none d-lg-flex ml-auto">

{/* nav item 1 */}
                            <li className="nav-item dropdown ml-2 mr-2">
                                <Link className="link" to="/home" style={{ textDecoration: 'none' }}>
                                    <span className="nav-link">Why Surl?</span>
                                </Link>
                            </li>

{/* nav item 2 */}

                            <li className="nav-item dropdown  ml-2 mr-2">
                                <Link to="/features" style={{ textDecoration: 'none' }}>
                                    <span className="nav-link">Features</span>
                                </Link>
                            </li>

{/* nav item 3 */}
                            <li className="nav-item dropdown  ml-2 mr-2">
                                <Link className="link" to="/subscription" style={{ textDecoration: 'none' }}>
                                    <span className="nav-link">Pricing</span>
                                </Link>
                                <div className="underline"></div>
                            </li>


                            <li className="nav-item dropdown  ml-2 mr-2">
                                <Link className="link" to="/team" style={{ textDecoration: 'none' }}>
                                    <span className="nav-link">Team</span>
                                </Link>
                                <div className="underline"></div>
                            </li>
                        </ul>
{/* nav 2 */}

                        <ul className="navbar-nav ml-auto">

                            {!isAuth() && (
                                <>
                                    <li className="nav-item mr-3">
                                        <Link className="nav-link" to="/login">Log in</Link>
                                    </li>

                                    <li className="nav-item mr-4">
                                        <Link className="nav-link signup" to="/signup">Sign up</Link>
                                    </li>
                                </>
                            )}

                            {isAuth() && (
                                <>

                                    <li className="nav-item mr-4">
                                            <Link className="nav-link signup" to="/dashboard">Dashboard</Link>
                                    </li>

                                    <li className="nav-item mr-4">
                                        <Link className="nav-link" to='/profile'>
                                            Profile
                                        </Link>
                                    </li>

                                    <li className="nav-item mr-4">
                                
                                        <Link className="nav-link" onClick={() => {
                                                signout(() => {
                                                    console.log('logged out')
                                                })
                                            }} to='/'>
                                            Logout
                                        </Link>

                                    </li>

                                </>
                            )}

                            
                        </ul>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default withRouter(Header)