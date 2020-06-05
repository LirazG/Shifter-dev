import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';

const smir = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',]
const Employees = (props) => {
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
                        className="employees-list__content"
                        {...provided.droppableProps}
                    >
                        <div >
                            {smir.map((item, index) =>
                                <Draggable draggableId={String(index)} index={index} key={'index' + index * 233}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={"employees-list__content__employee"}
                                        >
                                            <h4>My draggable</h4>
                                        </div>
                                    )}
                                </Draggable>
                            )}
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
