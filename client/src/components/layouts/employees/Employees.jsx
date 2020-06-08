import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
//api
import { generalGetRequest } from '../../../functions/api';
//routes
import { GET_EMPLOYEES, EMPLOYES_AUTO_COMPLETE, GET_EMPLOYEES_BY_NAME } from '../../../config/routes';
//context
import { UserDataContext } from '../../../contexts/UserDataContext';

const Employees = (props) => {

    const [employees, setEmployees] = useState([]);
    const [allowFetching, setAllowFetching] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [blurBlocker, setBlurBlocker] = useState(false);
    const [autoCompleteTimeout, setAutoCompleteTimeout] = useState(null);
    const [autoCompleteValues, setAutoCompleteValues] = useState(null);
    const [paginationData, setPaginationData] = useState({ skip: 0, limit: 20 });

    const { userData } = useContext(UserDataContext);

    //fetch employees data on mount
    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, [paginationData.skip]);

    //data feting function
    const fetchData = async (refreshData = false) => {
        let employeesResponse = await generalGetRequest(
            `${GET_EMPLOYEES}/?userId=${userData._id}&skip=${paginationData.skip}&limit=${paginationData.limit}`
        );
        if (employeesResponse.status === 200) {
            // prevent data duplication when search input deleted
            if (refreshData) {
                setEmployees(employeesResponse.data);
                return;
            }

            let newEmployeeList = [...employees, ...employeesResponse.data]
            setEmployees(newEmployeeList);
        }
    }

    //scroll handler fetching more employees on scroll
    const handleListScroll = () => {
        let scrolledDiv = document.getElementsByClassName("employees-list__content")[0];
        //calc scroll bottom for more data fetching (number 2 is 1 px border top and bottom, 100 is px offset for data fetch)
        let scrolledToOffset = scrolledDiv.scrollTop >= (scrolledDiv.scrollHeight - scrolledDiv.offsetHeight + 2) - 100;

        if (!scrolledToOffset) {
            setAllowFetching(true);
        }

        if (allowFetching && scrolledToOffset) {
            setAllowFetching(false);
            setPaginationData({ ...paginationData, skip: (paginationData.skip + 1) * paginationData.limit });
        }
    }

    const autoComplete = async (e) => {
        let searchQuery = e.target.value

        //update value in state
        setSearchValue(searchQuery);

        //throttle data fetching from server
        setAutoCompleteTimeout(
            clearTimeout(autoCompleteTimeout)
        );

        if (!searchQuery) {
            setAutoCompleteValues(null);
            await fetchData(true);
            return;
        }

        setAutoCompleteTimeout(
            setTimeout(async () => {
                let autoCompleteResponse = await generalGetRequest(EMPLOYES_AUTO_COMPLETE + `?userId=${userData._id}&searchQuery=${searchQuery}`);
                if (autoCompleteResponse.status === 200)
                    setAutoCompleteValues(autoCompleteResponse.data)
            }, 500)
        );
    }

    const searchEmployee = async (e) => {
        //detect enter click
        if (e.keyCode === 13 || e === 'click')
            if (searchValue) {
                let searchResponse = await generalGetRequest(GET_EMPLOYEES_BY_NAME + `?userId=${userData._id}&searchQuery=${searchValue}`);
                if (searchResponse.status === 200) {
                    setEmployees(searchResponse.data);
                    setAutoCompleteValues(null);
                }
            }
    }

    const handleBlur = (e) => {
        if (!blurBlocker)
            setAutoCompleteValues(null);
    }

    return (
        <div className="employees-list">
            <header className="employees-list__search">
                <input
                    type="text"
                    value={searchValue}
                    placeholder="Search employee..."
                    onChange={autoComplete}
                    onKeyDown={searchEmployee}
                    onBlur={handleBlur}
                />
                <figure>
                    <SvgIcon
                        component={SearchIcon}
                    />
                </figure>

                {autoCompleteValues ?
                    <ul className="employees-list__search__auto-complete">
                        {autoCompleteValues.length === 0 ?
                            <div className="employees-list__search__auto-complete--no-results">No results</div>
                            :
                            null
                        }

                        {autoCompleteValues.length > 0 && autoCompleteValues.map(employee =>
                            <li
                                //employee name is always unique by default (Employee model Mongoose Schema)
                                key={employee}
                                onClick={searchEmployee.bind(null, 'click')}
                                onMouseEnter={setBlurBlocker.bind(null, true)}
                                onMouseLeave={setBlurBlocker.bind(null, false)}
                            >
                                {employee}
                            </li>
                        )}
                    </ul>
                    :
                    null
                }

            </header>

            <Droppable droppableId={'employee-list'} key={'employee-list'}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={employees.length === 0 ? "employees-list__content employees-list__content--empty" : "employees-list__content"}
                        onScroll={handleListScroll}
                        {...provided.droppableProps}
                    >
                        <div >
                            {employees.map((employee, index) =>
                                <Draggable draggableId={employee._id} index={index} key={employee._id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={"employees-list__content__employee"}
                                        >
                                            <div>
                                                <h4>{employee.fullName}</h4>
                                                <h4>{employee.title ? employee.title : null}</h4>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            )}
                            {employees.length === 0 ?
                                <Fragment>
                                    <SvgIcon
                                        component={PersonAddIcon}
                                    />
                                    <h2>No employees found</h2>
                                </Fragment>
                                :
                                null
                            }
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <footer className="employees-list__footer">
                <button onClick={props.openAddEmployeeModal}>
                    <span>Add employee</span>
                </button>
            </footer>
        </div >
    )
}

export default Employees;
