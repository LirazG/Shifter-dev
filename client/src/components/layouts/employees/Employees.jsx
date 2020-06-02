import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';

const smir = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',]
const Employees = () => {
    return (
        <div className="employees-list">
            <header className="employees-list__search">
                <input type="text" placeholder="Search employee..." />
                <figure>
                    <SvgIcon
                        component={SearchIcon}
                    />
                </figure>
            </header>

            <div className="employees-list__content">
                {smir.map(item => <div style={{ width: '100%', height: '4rem', borderRadius: '5px', backgroundColor: 'white', marginBottom: '1rem' }}></div>)}
            </div>
            <footer className="employees-list__footer">
                <button><span>Add employee</span></button>
            </footer>
        </div>
    )
}

export default Employees;
