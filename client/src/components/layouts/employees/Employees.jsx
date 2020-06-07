import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
//api
import { generalGetRequest } from '../../../functions/api';
//routes
import { GET_EMPLOYEES } from '../../../config/routes';
//context
import { UserDataContext } from '../../../contexts/UserDataContext';
// general functions
import { throttling } from '../../../functions/general';

const Employees = (props) => {

    const [employees, setEmployees] = useState([]);
    const [allowFetching, setAllowFetching] = useState(true);
    const [paginationData, setPaginationData] = useState({ skip: 0, limit: 20 });

    const { userData } = useContext(UserDataContext);

    //fetch employees data on mount
    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, [paginationData.skip]);

    //data feting function
    const fetchData = async () => {
        let employeesResponse = await generalGetRequest(
            `${GET_EMPLOYEES}/?userId=${userData._id}&skip=${paginationData.skip}&limit=${paginationData.limit}`
        );
        if (employeesResponse.status === 200) {
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
        </div>
    )
}

export default Employees;
