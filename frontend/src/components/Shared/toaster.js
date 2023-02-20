import { React } from "react"
const Toaster = ({ message, onClose, type }) => {
    return (
        <div className={`alert ${type === "error" ? "alert-danger" : "alert-success "} alert-dismissible fade show`} role="alert" id="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}>
            </button>
        </div>
    )
}

export default Toaster