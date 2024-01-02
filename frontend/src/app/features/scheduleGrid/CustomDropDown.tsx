function CustomDropDown() {
    return(
        <div className="d-flex w-100 justify-content-end">
            <div className="dropdown">
                <button className="button-secondary d-flex justify-content-center align-items-center gap-2 p-2 border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img className="button__image" src="./avatar.jpeg" alt="" />
                    <p className="m-0">Assign</p>
                </button>
                <ul className="dropdown-menu assign__dropdown p-0 m-0 rounded-0">
                    <li className="position-relative">
                        <input className="assign__search-box rounded-0 form-control" placeholder="Search User" type="text"/>
                        <span className="assign__search-box__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="MagnifyingGlass">
                                    <path id="Vector" d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z" stroke="#1D2026" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path id="Vector_2" d="M16.4431 16.4438L20.9994 21.0002" stroke="#1D2026" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                            </svg>
                        </span>
                    </li>
                    {/* Map Items Here */}
                    <li className="assign__list-item d-flex align-items-center gap-3 px-3 py-2">
                        <img className="assign__image" src="./avatar.jpeg" alt="" />
                        <p className="m-0 font-md">User Name <span className="font-sm text-gray-600 d-block m-0 p-0">UI/UX Designer</span></p>
                    </li>
                    <li className="assign__list-item d-flex align-items-center gap-3 px-3 py-2">
                        <img className="assign__image" src="./avatar.jpeg" alt="" />
                        <p className="m-0 font-md">User Name <span className="font-sm text-gray-600 d-block m-0 p-0">UI/UX Designer</span></p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default CustomDropDown;