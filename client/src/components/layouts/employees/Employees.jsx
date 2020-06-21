import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
//components
import Spinner from '../../globals/spinners/Spinner';
//api
import { generalGetRequest } from '../../../functions/api';
//routes
import { GET_EMPLOYEES, EMPLOYES_AUTO_COMPLETE, GET_EMPLOYEES_BY_NAME } from '../../../config/routes';
//context
import { UserDataContext } from '../../../contexts/UserDataContext';

const Employees = (props) => {
    //CONSTANTS
    const EMPLOYEE_LIST_ELEMENT = document.getElementsByClassName("employees-list__content")[0] || '';
    const INITIAL_PAGINATION_LIMIT = 20;
    //state
    const [employees, setEmployees] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [blurBlocker, setBlurBlocker] = useState(false);
    const [autoCompleteTimeout, setAutoCompleteTimeout] = useState(null);
    const [autoCompleteValues, setAutoCompleteValues] = useState(null);
    const [paginationData, setPaginationData] = useState({ skip: null, limit: INITIAL_PAGINATION_LIMIT });
    const [loading, setLoading] = useState(false);
    const [blockApi, setBlockApi] = useState(false);
    const [searchResetButton, setSearchResetButton] = useState(false);

    //contexts
    const { userData } = useContext(UserDataContext);

    //fetch employees data
    useEffect(() => {
        if (paginationData.skip || paginationData.skip === 0)
            fetchData();
    }, [paginationData.skip]);

    useEffect(() => {
        // increment limit if element is too big for scrolling (so more data could be fetched and won't persist on initial results)
        let hasVerticalScrollbar = EMPLOYEE_LIST_ELEMENT.scrollHeight > EMPLOYEE_LIST_ELEMENT.clientHeight;
        if (!hasVerticalScrollbar && !searchResetButton) {
            if (employees.length === 0) {
                setPaginationData({ ...paginationData, skip: 0 });
            } else {
                setPaginationData({ ...paginationData, skip: paginationData.skip + paginationData.limit });
            }

        }
    }, [employees.length, searchResetButton]);

    //set dragged employee in parent component
    useEffect(() => {
        props.setDraggedEmployee(employees[props.draggedEmployeeIndex])
    }, [props.draggedEmployeeIndex]);

    //get employees list from server
    const fetchData = async () => {
        // block api calls if all employees from DB are fetched already
        if (blockApi)
            return;
        setLoading(true);

        let employeesResponse = await generalGetRequest(
            `${GET_EMPLOYEES}/?userId=${userData._id}&skip=${paginationData.skip}&limit=${paginationData.limit}`
        );
        if (employeesResponse.status === 200) {
            // set blocker of api calls if all employees fetched already
            if (employeesResponse.data.length === 0)
                setBlockApi(true);

            let newEmployeeList = [...employees, ...employeesResponse.data];
            setEmployees(newEmployeeList);
        }
        //set loader false
        setLoading(false);
    }

    //scroll handler fetching more employees on scroll
    const handleListScroll = () => {
        //calc scroll bottom for more data fetching (number 2 is 1 px border top and bottom, 100 is px offset for data fetch)
        let scrolledToOffset = EMPLOYEE_LIST_ELEMENT.scrollTop >= (EMPLOYEE_LIST_ELEMENT.scrollHeight - EMPLOYEE_LIST_ELEMENT.offsetHeight + 2) - 100;

        if (scrolledToOffset && !loading) {
            setPaginationData({ ...paginationData, skip: paginationData.skip + paginationData.limit });
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

        //reset all search params and fetch data accordingly if user cleared search
        if (!searchQuery) {
            setAutoCompleteValues(null);
            setBlockApi(false);
            return;
        }

        setAutoCompleteTimeout(
            setTimeout(async () => {
                setLoading(true);
                let autoCompleteResponse = await generalGetRequest(EMPLOYES_AUTO_COMPLETE + `?userId=${userData._id}&searchQuery=${searchQuery}`);
                if (autoCompleteResponse.status === 200) {
                    setAutoCompleteValues(autoCompleteResponse.data)
                    setLoading(false);
                }
            }, 500)
        );
    }

    const searchEmployee = async (e) => {
        //detect enter click
        if ((e.keyCode === 13 || e === 'click') && searchValue) {
            //scroll to top when searching to prevent possible bugs of data fetching
            EMPLOYEE_LIST_ELEMENT.scrollTop = 0;
            //generate search data
            let searchResponse = await generalGetRequest(GET_EMPLOYEES_BY_NAME + `?userId=${userData._id}&searchQuery=${searchValue}`);
            if (searchResponse.status === 200) {
                setSearchResetButton(true);
                setEmployees(searchResponse.data);
                setAutoCompleteValues(null);
            }
        }
    }

    const handleBlur = (e) => {
        if (!blurBlocker)
            setAutoCompleteValues(null);
    }

    const resetSearch = () => {
        // reset all search params
        setBlockApi(false);
        setEmployees([]);
        setLoading(true);
        setSearchResetButton(false);
        setPaginationData({ skip: 0, limit: INITIAL_PAGINATION_LIMIT });
        setSearchValue('');
    }

    return (
        <div className="employees-list">
            <header className="employees-list__search">
                <input
                    type="text"
                    value={searchValue}
                    placeholder="Employee name"
                    onChange={autoComplete}
                    onKeyDown={searchEmployee}
                    onBlur={handleBlur}
                />
                <figure>
                    {loading ?
                        <Spinner size={40} />
                        :
                        searchResetButton ?
                            <SvgIcon
                                component={ClearIcon}
                                style={{ cursor: 'pointer' }}
                                onClick={resetSearch}
                            />
                            :
                            <SvgIcon
                                component={SearchIcon}
                                onClick={searchEmployee.bind(null, 'click')}
                            />
                    }

                </figure>

                {autoCompleteValues ?
                    <ul className="employees-list__search__auto-complete">
                        {autoCompleteValues.length === 0 ?
                            <div
                                className="employees-list__search__auto-complete--no-results"
                                onMouseEnter={setBlurBlocker.bind(null, true)}
                                onMouseLeave={setBlurBlocker.bind(null, false)}
                            >
                                No results
                            </div>
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
                                            className={"employees-draggable employees-draggable--list"}
                                        >
                                            <div>
                                                <h4>{employee.fullName}</h4>
                                                <h4>{employee.title ? employee.title : null}</h4>
                                            </div>
                                            <SvgIcon
                                                component={DragIndicatorIcon}
                                            />

                                        </div>
                                    )}
                                </Draggable>
                            )}
                            {employees.length === 0 && !loading ?
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

export default React.memo(Employees);
