import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
//context
import { ShiftConfigurationContext } from '../../../contexts/ShiftConfigurationContext';
import { UserDataContext } from '../../../contexts/UserDataContext';
//api
import { generalGetRequest } from '../../../functions/api';
//routes
import { FETCH_SHIFTS } from '../../../config/routes';
//types
import { SET_SHIFTS } from '../../../reducers/shiftConfigurationReducer'
//components
import Navbar from '../../globals/navbar/Navbar';
import Calender from '../../layouts/calender/Calender';
import Employees from '../../layouts/employees/Employees';
import CustomModal from '../../globals/modal/CustomModal';
import AddEmployeeForm from './parts/AddEmployeeForm';
import ShiftSettingsForm from './parts/ShiftSettingsForm';

const MainController = () => {

    const [activeModal, setActiveModal] = useState(false);
    const [lastDragActionData, setLastDragActionData] = useState(null);
    const { shiftConfigsDispatch } = useContext(ShiftConfigurationContext);
    const { userData } = useContext(UserDataContext);

    //fetch shifts on mount
    useEffect(() => {
        (async () => {
            let shifts = await generalGetRequest(`${FETCH_SHIFTS}/?userId=${userData._id}`);
            if (shifts.status === 200)
                shiftConfigsDispatch({ type: SET_SHIFTS, payload: shifts.data });
        })();
    }, []);

    const onDragEnd = (data) => {
        if (!data.destination || !data.source || data.destination.droppableId === 'employee-list')
            return;
        if (data.destination.droppableId === data.source.droppableId && data.destination.index === data.source.index)
            return;
        setLastDragActionData(data);
    }

    return (
        <div className="main-controller">
            <CustomModal
                active={activeModal}
                cancelModal={setActiveModal.bind(null, '')}
            >
                <div className="main-controller__settings">
                    <section>
                        {activeModal === 'settings' ?
                            <ShiftSettingsForm active={activeModal === 'settings'} />
                            :
                            activeModal === 'addEmployee' ?
                                <AddEmployeeForm />
                                :
                                null
                        }
                    </section>
                </div>
            </CustomModal>

            <Navbar
                toggleSettingsModal={setActiveModal.bind(null, 'settings')}
            />
            <div className="main-controller__content">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Calender dndAction={lastDragActionData} />
                    <Employees openAddEmployeeModal={setActiveModal.bind(null, 'addEmployee')} />
                </DragDropContext>
            </div>
        </div>
    )
}

export default MainController;
