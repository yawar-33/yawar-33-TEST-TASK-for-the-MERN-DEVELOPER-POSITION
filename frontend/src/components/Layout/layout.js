import { React } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
const Layout = () => {
    const location = useLocation();
    const Navigate = useNavigate()
    return (
        <>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">TEST</a>
                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
                        <a className="nav-link px-3" href="#"
                            onClick={() => {
                                localStorage.removeItem('token');
                                Navigate("/login")
                            }}
                        >Sign out</a>
                    </div>
                </div>
            </header>
            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                        <div className="position-sticky pt-3 sidebar-sticky">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <Link to={'/dashboard'} className={location.pathname === "/dashboard" ? "nav-link active" : "nav-link"}>
                                        <span data-feather="home" className="align-text-bottom"></span>
                                        Dashboard
                                    </Link>
                                </li>


                                <li className="nav-item">
                                    <Link to={'/categories'} className={location.pathname === "/categories" ? "nav-link active" : "nav-link"}>
                                        <span data-feather="file" className="align-text-bottom"></span>
                                        Categories
                                    </Link>

                                </li>

                                <li className="nav-item">
                                    <Link to={'/cars'} className={location.pathname === "/cars" ? "nav-link active" : "nav-link"}>
                                        <span data-feather="shopping-cart" className="align-text-bottom"></span>
                                        Cars
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div >
        </>
    )
}
export default Layout